import { is } from '@electron-toolkit/utils'
import { BrowserWindow, shell } from 'electron'
import EventEmitter from 'events'
import path from 'path'

export class ElectronWindow extends EventEmitter {
  private mainWindow: BrowserWindow
  constructor() {
    super()
    const preload = path.join(__dirname, '../preload/index.js')
    const mainWindow = new BrowserWindow({
      width: 1145,
      height: 750,
      show: false,
      autoHideMenuBar: true,
      titleBarStyle: 'hidden',
      // icon: icon,

      // frame: false,
      // transparent: true,
      // vibrancy: 'under-window',
      // visualEffectState: 'active',

      webPreferences: {
        devTools: is.dev,
        contextIsolation: true,
        nodeIntegration: true,
        nodeIntegrationInSubFrames: false,

        preload: preload,
        sandbox: false,
      },
    })

    mainWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url)
      return { action: 'deny' }
    })
    mainWindow.webContents.on('will-navigate', (event, url) => {
      event.preventDefault()
      this.emit('navigation-attempt', event, url)
    })
    this.mainWindow = mainWindow
  }

  get window() {
    return this.mainWindow
  }

  getWindowHandleAddress = () => {
    const handle = this.mainWindow.getNativeWindowHandle()
    const windowHandle = handle.readBigInt64LE(0)
    return Number(windowHandle)
  }
  // enableBlur = () => {
  //   try {
  //     acrylic.setBlurBehindEffect(this.getWindowAddress())
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
  // disableBlur = () => {
  //   try {
  //     acrylic.disableBlurBehindEffect(this.getWindowAddress())
  //   } catch (err) {
  //     console.error(err)
  //   }
  // }
  getBrowserWindow() {
    return this.mainWindow
  }

  loadUrl(url: string) {
    this.mainWindow.loadURL(url)
  }

  showWindow() {
    this.mainWindow.show()
    // mainWindow.maximize()
    // @ts-expect-error Available
    this.mainWindow.openDevTools()
  }
}
