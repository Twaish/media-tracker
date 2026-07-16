import * as monaco from 'monaco-editor'
import { Editor, loader } from '@monaco-editor/react'

import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import { useAutomationEditorStore } from '../stores/automationEditorStore'

self.MonacoEnvironment = {
  getWorker() {
    return new editorWorker()
  },
}

loader.config({ monaco })

monaco.editor.defineTheme('editor-theme', {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#0a0a0a',
  },
})

export function AutomationEditor() {
  const source = useAutomationEditorStore((s) => s.source)
  const setSource = useAutomationEditorStore((s) => s.setSource)

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden">
      <Editor
        value={source}
        onChange={(value) => setSource(value ?? '')}
        theme="editor-theme"
        options={{
          minimap: { enabled: false },
          tabSize: 2,
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
          padding: {
            top: 16,
            bottom: 16,
          },
        }}
      />
    </div>
  )
}
