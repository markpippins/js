import { Injectable } from '@angular/core';

declare global {
  interface Window {
    require: any;
    process: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ElectronService {
  private ipc: any;

  // Mock data for demo purposes
  private mockLocalFiles = [
    { name: 'Documents', isDirectory: true, size: 0, modified: new Date('2024-01-15') },
    { name: 'Pictures', isDirectory: true, size: 0, modified: new Date('2024-01-10') },
    { name: 'Downloads', isDirectory: true, size: 0, modified: new Date('2024-01-20') },
    { name: 'resume.pdf', isDirectory: false, size: 245760, modified: new Date('2024-01-18') },
    { name: 'project.zip', isDirectory: false, size: 1048576, modified: new Date('2024-01-22') },
    { name: 'photo.jpg', isDirectory: false, size: 2097152, modified: new Date('2024-01-16') }
  ];

  private mockRemoteFiles = [
    { name: 'public_html', isDirectory: true, size: 0, modified: new Date('2024-01-12') },
    { name: 'logs', isDirectory: true, size: 0, modified: new Date('2024-01-14') },
    { name: 'backup', isDirectory: true, size: 0, modified: new Date('2024-01-08') },
    { name: 'index.html', isDirectory: false, size: 4096, modified: new Date('2024-01-19') },
    { name: 'style.css', isDirectory: false, size: 8192, modified: new Date('2024-01-17') },
    { name: 'script.js', isDirectory: false, size: 12288, modified: new Date('2024-01-21') }
  ];

  constructor() {
    if (this.isElectron) {
      this.ipc = window.require('electron').ipcRenderer;
    }
  }

  get isElectron(): boolean {
    return !!(window && window.process && window.process.type);
  }

  // Local file operations (mocked for demo)
  async getLocalFiles(path: string): Promise<any[]> {
    if (this.isElectron) {
      return this.ipc.invoke('get-local-files', path);
    }
    return Promise.resolve([...this.mockLocalFiles]);
  }

  async createLocalDirectory(path: string, name: string): Promise<boolean> {
    if (this.isElectron) {
      return this.ipc.invoke('create-local-directory', path, name);
    }
    this.mockLocalFiles.push({
      name,
      isDirectory: true,
      size: 0,
      modified: new Date()
    });
    return Promise.resolve(true);
  }

  async deleteLocalFile(path: string): Promise<boolean> {
    if (this.isElectron) {
      return this.ipc.invoke('delete-local-file', path);
    }
    const fileName = path.split('/').pop() || '';
    const index = this.mockLocalFiles.findIndex(f => f.name === fileName);
    if (index > -1) {
      this.mockLocalFiles.splice(index, 1);
    }
    return Promise.resolve(true);
  }

  async renameLocalFile(oldPath: string, newPath: string): Promise<boolean> {
    if (this.isElectron) {
      return this.ipc.invoke('rename-local-file', oldPath, newPath);
    }
    const oldName = oldPath.split('/').pop() || '';
    const newName = newPath.split('/').pop() || '';
    const file = this.mockLocalFiles.find(f => f.name === oldName);
    if (file) {
      file.name = newName;
    }
    return Promise.resolve(true);
  }

  async selectDirectory(): Promise<string | null> {
    if (this.isElectron) {
      return this.ipc.invoke('select-directory');
    }
    return Promise.resolve('/home/user');
  }

  // Remote connection operations (mocked for demo)
  async connectSftp(config: any): Promise<any> {
    if (this.isElectron) {
      return this.ipc.invoke('connect-sftp', config);
    }
    return Promise.resolve({ 
      success: true, 
      message: `Connected to ${config.host} via SFTP (Demo Mode)` 
    });
  }

  async connectFtp(config: any): Promise<any> {
    if (this.isElectron) {
      return this.ipc.invoke('connect-ftp', config);
    }
    return Promise.resolve({ 
      success: true, 
      message: `Connected to ${config.host} via FTP (Demo Mode)` 
    });
  }

  async getRemoteFiles(path: string, protocol: string): Promise<any[]> {
    if (this.isElectron) {
      return this.ipc.invoke('get-remote-files', path, protocol);
    }
    return Promise.resolve([...this.mockRemoteFiles]);
  }

  async uploadFile(localPath: string, remotePath: string, protocol: string): Promise<boolean> {
    if (this.isElectron) {
      return this.ipc.invoke('upload-file', localPath, remotePath, protocol);
    }
    const fileName = localPath.split('/').pop() || '';
    const localFile = this.mockLocalFiles.find(f => f.name === fileName);
    if (localFile && !this.mockRemoteFiles.find(f => f.name === fileName)) {
      this.mockRemoteFiles.push({
        name: fileName,
        isDirectory: localFile.isDirectory,
        size: localFile.size,
        modified: new Date()
      });
    }
    return Promise.resolve(true);
  }

  async downloadFile(remotePath: string, localPath: string, protocol: string): Promise<boolean> {
    if (this.isElectron) {
      return this.ipc.invoke('download-file', remotePath, localPath, protocol);
    }
    const fileName = remotePath.split('/').pop() || '';
    const remoteFile = this.mockRemoteFiles.find(f => f.name === fileName);
    if (remoteFile && !this.mockLocalFiles.find(f => f.name === fileName)) {
      this.mockLocalFiles.push({
        name: fileName,
        isDirectory: remoteFile.isDirectory,
        size: remoteFile.size,
        modified: new Date()
      });
    }
    return Promise.resolve(true);
  }

  async disconnect(): Promise<boolean> {
    if (this.isElectron) {
      return this.ipc.invoke('disconnect');
    }
    return Promise.resolve(true);
  }
}
