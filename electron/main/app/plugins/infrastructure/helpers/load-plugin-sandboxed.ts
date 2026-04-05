import vm from 'vm'
import fs from 'fs/promises'
import path from 'path'
import { createRequire } from 'module'
import { PluginManifest } from '../../application/models/PluginManifest'
import { PluginModule } from '../adapters/PluginModule'
import { Stats } from 'fs'

const BLOCKED_MODULES = new Set([
  'electron',
  'child_process',
  'worker_threads',
  'cluster',
  'v8',
  'inspector',
  'repl',
  'vm', // prevent sandbox escape
])

const ALLOWED_MODULES = new Set([
  'path',
  'url',
  'util',
  'crypto',
  'buffer',
  'stream',
  'events',
  'assert',
  'zlib',
])

type ScopedFs = {
  readFile(path: string, options?: BufferEncoding): Promise<string | Buffer>
  writeFile(path: string, data: string | Buffer): Promise<void>
  mkdir(
    path: string,
    options?: { recursive: true },
  ): Promise<string | undefined>
  readdir(path: string): Promise<string[]>
  stat(path: string): Promise<Stats>
  unlink(path: string): Promise<void>
}

function createScopedFs(pluginDir: string): ScopedFs {
  const assertWithinPlugin = (target: string) => {
    const resolved = path.resolve(target)
    if (!resolved.startsWith(path.resolve(pluginDir))) {
      throw new Error(
        `Permission denied: "${resolved}" is outside the plugin directory`,
      )
    }
    return resolved
  }

  return {
    readFile: (p, options) => fs.readFile(assertWithinPlugin(p), options),
    writeFile: (p, data) => fs.writeFile(assertWithinPlugin(p), data),
    mkdir: (p, options) => fs.mkdir(assertWithinPlugin(p), options),
    readdir: (p) => fs.readdir(assertWithinPlugin(p)),
    stat: (p) => fs.stat(assertWithinPlugin(p)),
    unlink: (p) => fs.unlink(assertWithinPlugin(p)),
  }
}

function createPluginRequire(pluginDir: string) {
  const nativeRequire = createRequire(path.join(pluginDir, 'index.js'))

  return function sandboxedRequire(moduleName: string): unknown {
    if (BLOCKED_MODULES.has(moduleName)) {
      throw new Error(`Plugin is not allowed to use module "${moduleName}"`)
    }

    if (
      moduleName === 'fs' ||
      moduleName === 'fs/promises' ||
      moduleName === 'node:fs/promises' ||
      moduleName === 'node:fs'
    ) {
      return {
        promises: createScopedFs(pluginDir),
        ...createScopedFs(pluginDir),
      }
    }

    if (ALLOWED_MODULES.has(moduleName) || moduleName.startsWith('node:')) {
      const bare = moduleName.replace('node:', '')
      if (BLOCKED_MODULES.has(bare)) {
        throw new Error(`Plugin is not allowed to use module "${bare}"`)
      }
      return nativeRequire(moduleName)
    }

    if (moduleName.startsWith('.')) {
      return nativeRequire(moduleName)
    }

    return nativeRequire(moduleName)
  }
}

export async function loadPluginSandboxed(
  dir: string,
): Promise<{ manifest: PluginManifest; module: PluginModule }> {
  const manifest = JSON.parse(
    await fs.readFile(path.join(dir, 'manifest.json'), 'utf-8'),
  ) as PluginManifest

  if (manifest.name == null) {
    throw new Error(`Plugin at ${dir} is missing a required name`)
  }

  const indexPath = path.join(dir, 'index.js')
  const code = await fs.readFile(indexPath, 'utf-8')

  const sandboxedRequire = createPluginRequire(dir)

  const sandbox = {
    require: sandboxedRequire,
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    setImmediate,
    clearImmediate,
    Promise,
    URL,
    URLSearchParams,
    TextEncoder,
    TextDecoder,
    Buffer,
    process: {
      env: {},
      version: process.version,
      platform: process.platform,
      nextTick: process.nextTick.bind(process),
    },
    import: () => {
      throw new Error(`Dynamic import() is not allowed in plugins`)
    },
    module: { exports: {} as { default?: unknown } },
    exports: {} as unknown,
    __filename: indexPath,
    __dirname: dir,
  }
  sandbox.exports = sandbox.module.exports

  const DYNAMIC_IMPORT_RE = /\bimport\s*\(/
  if (DYNAMIC_IMPORT_RE.test(code)) {
    throw new Error(
      `Plugin "${manifest.name}" uses dynamic import(), which is not permitted`,
    )
  }

  const wrappedCode = `
    (function(require, module, exports, __filename, __dirname, process) {
      ${code}
    })(require, module, exports, __filename, __dirname, process);
  `

  try {
    const script = new vm.Script(wrappedCode, {
      filename: indexPath,
    })

    const context = vm.createContext(sandbox, {
      name: `plugin:${manifest.name}`,
    })

    script.runInContext(context, { timeout: 5000 })
  } catch (err) {
    throw new Error(
      `Plugin "${manifest.name}" failed to load: ${err instanceof Error ? err.message : String(err)}`,
    )
  }

  const pluginModule = sandbox.module.exports.default ?? sandbox.module.exports

  return { manifest, module: pluginModule as PluginModule }
}
