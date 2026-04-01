import { ipcRenderer } from 'electron'
import exposeContexts from '@/helpers/ipc/context-exposer'

exposeContexts()

window.addEventListener('message', (event) => {
  if (event.data === 'START_ORPC') {
    const [serverPort] = event.ports

    ipcRenderer.postMessage('START_ORPC', null, [serverPort])
  }
})
