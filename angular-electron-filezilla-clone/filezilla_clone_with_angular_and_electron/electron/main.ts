import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs-extra';
import * as SftpClient from 'ssh2-sftp-client';
import FtpClient = require('ftp');

let mainWindow: BrowserWindow;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    title: 'FileZilla Clone'
  });

  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:4200');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../angular/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null as any;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// File system operations
ipcMain.handle('get-local-files', async (event, dirPath: string) => {
  try {
    const files = await fs.readdir(dirPath, { withFileTypes: true });
    return files.map(file => ({
      name: file.name,
      isDirectory: file.isDirectory(),
      size: file.isDirectory() ? 0 : fs.statSync(path.join(dirPath, file.name)).size,
      modified: fs.statSync(path.join(dirPath, file.name)).mtime
    }));
  } catch (error) {
    throw new Error(`Failed to read directory: ${error}`);
  }
});

ipcMain.handle('create-local-directory', async (event, dirPath: string, name: string) => {
  try {
    await fs.mkdir(path.join(dirPath, name));
    return true;
  } catch (error) {
    throw new Error(`Failed to create directory: ${error}`);
  }
});

ipcMain.handle('delete-local-file', async (event, filePath: string) => {
  try {
    await fs.remove(filePath);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete file: ${error}`);
  }
});

ipcMain.handle('rename-local-file', async (event, oldPath: string, newPath: string) => {
  try {
    await fs.rename(oldPath, newPath);
    return true;
  } catch (error) {
    throw new Error(`Failed to rename file: ${error}`);
  }
});

// FTP/SFTP operations
let sftpClient: SftpClient | null = null;
let ftpClient: any = null;

ipcMain.handle('connect-sftp', async (event, config: any) => {
  try {
    sftpClient = new SftpClient();
    await sftpClient.connect(config);
    return { success: true, message: 'Connected to SFTP server' };
  } catch (error) {
    return { success: false, message: `SFTP connection failed: ${error}` };
  }
});

ipcMain.handle('connect-ftp', async (event, config: any) => {
  return new Promise((resolve) => {
    ftpClient = new FtpClient();
    ftpClient.connect(config);
    
    ftpClient.on('ready', () => {
      resolve({ success: true, message: 'Connected to FTP server' });
    });
    
    ftpClient.on('error', (error: any) => {
      resolve({ success: false, message: `FTP connection failed: ${error}` });
    });
  });
});

ipcMain.handle('get-remote-files', async (event, dirPath: string, protocol: string) => {
  try {
    if (protocol === 'sftp' && sftpClient) {
      const files = await sftpClient.list(dirPath);
      return files.map((file: any) => ({
        name: file.name,
        isDirectory: file.type === 'd',
        size: file.size,
        modified: new Date(file.modifyTime)
      }));
    } else if (protocol === 'ftp' && ftpClient) {
      return new Promise((resolve, reject) => {
        ftpClient.list(dirPath, (err: any, list: any) => {
          if (err) reject(err);
          else {
            const files = list.map((file: any) => ({
              name: file.name,
              isDirectory: file.type === 'd',
              size: file.size,
              modified: new Date(file.date)
            }));
            resolve(files);
          }
        });
      });
    }
    return [];
  } catch (error) {
    throw new Error(`Failed to list remote files: ${error}`);
  }
});

ipcMain.handle('upload-file', async (event, localPath: string, remotePath: string, protocol: string) => {
  try {
    if (protocol === 'sftp' && sftpClient) {
      await sftpClient.put(localPath, remotePath);
    } else if (protocol === 'ftp' && ftpClient) {
      return new Promise((resolve, reject) => {
        ftpClient.put(localPath, remotePath, (err: any) => {
          if (err) reject(err);
          else resolve(true);
        });
      });
    }
    return true;
  } catch (error) {
    throw new Error(`Failed to upload file: ${error}`);
  }
});

ipcMain.handle('download-file', async (event, remotePath: string, localPath: string, protocol: string) => {
  try {
    if (protocol === 'sftp' && sftpClient) {
      await sftpClient.get(remotePath, localPath);
    } else if (protocol === 'ftp' && ftpClient) {
      return new Promise((resolve, reject) => {
        ftpClient.get(remotePath, (err: any, stream: any) => {
          if (err) reject(err);
          else {
            const writeStream = fs.createWriteStream(localPath);
            stream.pipe(writeStream);
            stream.on('end', () => resolve(true));
            stream.on('error', reject);
          }
        });
      });
    }
    return true;
  } catch (error) {
    throw new Error(`Failed to download file: ${error}`);
  }
});

ipcMain.handle('disconnect', async () => {
  try {
    if (sftpClient) {
      await sftpClient.end();
      sftpClient = null;
    }
    if (ftpClient) {
      ftpClient.end();
      ftpClient = null;
    }
    return true;
  } catch (error) {
    throw new Error(`Failed to disconnect: ${error}`);
  }
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.filePaths[0] || null;
});
