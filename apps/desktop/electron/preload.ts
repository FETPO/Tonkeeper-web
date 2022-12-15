import { contextBridge, ipcRenderer } from 'electron';
import { Message } from '../src/libs/message';

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: (message: Message) => ipcRenderer.invoke('ping', message),
  // we can also expose variables, not just functions
});
