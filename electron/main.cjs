const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

function getDataPath() {
  return path.join(app.getPath('userData'), 'data.json');
}

function ensureDataFile() {
  const p = getDataPath();
  if (!fs.existsSync(p)) {
    fs.writeFileSync(p, JSON.stringify({ sections: [] }, null, 2), 'utf-8');
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../build/icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, '../dist/index.html'));
}

app.whenReady().then(() => {
  ensureDataFile();
  ipcMain.handle('data:load', async () => {
    ensureDataFile();
    const raw = fs.readFileSync(getDataPath(), 'utf-8');
    return JSON.parse(raw);
  });
  ipcMain.handle('data:save', async (_e, json) => {
    ensureDataFile();
    fs.writeFileSync(getDataPath(), JSON.stringify(json, null, 2), 'utf-8');
    return { ok: true };
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
