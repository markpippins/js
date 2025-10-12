import { Injectable } from '@angular/core';

// Try to import Tauri APIs dynamically to avoid breaking web builds
let tauriFs: any = null;
let tauriDialog: any = null;
let tauriInvoke: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const api = require('@tauri-apps/api');
  tauriFs = api.fs;
  tauriDialog = api.dialog;
  tauriInvoke = api.invoke;
} catch (e) {
  // not running under Tauri in dev server
}

@Injectable({ providedIn: 'root' })
export class FileService {
  get isTauri(): boolean {
    return !!tauriFs;
  }

  // Mock data similar to the Electron project
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

  constructor() {}

  async getLocalFiles(path: string): Promise<any[]> {
    if (this.isTauri && tauriFs && tauriInvoke) {
      // For simplicity, try invoking a Rust command that returns directory listing if configured.
      try {
        const result = await tauriInvoke('get_local_files', { path });
        return result;
      } catch (e) {
        console.warn('Tauri get_local_files invoke failed, falling back to mock', e);
      }
    }
    return Promise.resolve([...this.mockLocalFiles]);
  }

  async selectDirectory(): Promise<string | null> {
    if (this.isTauri && tauriDialog && tauriDialog.open) {
      try {
        const selected = await tauriDialog.open({ directory: true });
        return selected as string;
      } catch (e) {
        console.warn('Tauri dialog open failed', e);
      }
    }
    return Promise.resolve('/home/user');
  }

  async connectSftp(config: any): Promise<any> {
    // Tauri doesn't provide SFTP directly; this is a placeholder for application-specific logic
    return Promise.resolve({ success: true, message: `Connected to ${config.host} via SFTP (Demo Mode)` });
  }

  async connectFtp(config: any): Promise<any> {
    return Promise.resolve({ success: true, message: `Connected to ${config.host} via FTP (Demo Mode)` });
  }

  async getRemoteFiles(path: string, protocol: string): Promise<any[]> {
    return Promise.resolve([...this.mockRemoteFiles]);
  }

  async uploadFile(localPath: string, remotePath: string, protocol: string): Promise<boolean> {
    const fileName = localPath.split('/').pop() || '';
    const localFile = this.mockLocalFiles.find((f: any) => f.name === fileName);
    if (localFile && !this.mockRemoteFiles.find((f: any) => f.name === fileName)) {
      this.mockRemoteFiles.push({ name: fileName, isDirectory: localFile.isDirectory, size: localFile.size, modified: new Date() });
    }
    return Promise.resolve(true);
  }

  async downloadFile(remotePath: string, localPath: string, protocol: string): Promise<boolean> {
    const fileName = remotePath.split('/').pop() || '';
    const remoteFile = this.mockRemoteFiles.find((f: any) => f.name === fileName);
    if (remoteFile && !this.mockLocalFiles.find((f: any) => f.name === fileName)) {
      this.mockLocalFiles.push({ name: fileName, isDirectory: remoteFile.isDirectory, size: remoteFile.size, modified: new Date() });
    }
    return Promise.resolve(true);
  }

  async disconnect(): Promise<boolean> {
    return Promise.resolve(true);
  }
}
