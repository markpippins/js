const { app, BrowserWindow } = require('electron');
const path = require('path');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'));

  // Prevent window from closing immediately
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Optional: shows dev tools
  mainWindow.webContents.openDevTools();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  app.quit();
});
