const { contextBridge, ipcRenderer, clipboard } = require('electron');

contextBridge.exposeInMainWorld('dataApi', {
  loadAll: () => ipcRenderer.invoke('data:load'),
  saveAll: (json) => ipcRenderer.invoke('data:save', json),
});

contextBridge.exposeInMainWorld('electronClipboard', {
  writeText: (text) => clipboard.writeText(String(text ?? '')),
});
