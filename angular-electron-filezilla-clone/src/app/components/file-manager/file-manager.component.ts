import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElectronService } from '../../services/electron.service';

interface FileItem {
  name: string;
  isDirectory: boolean;
  size: number;
  modified: Date;
}

interface ConnectionConfig {
  protocol: 'ftp' | 'sftp';
  host: string;
  port: number;
  username: string;
  password: string;
}

interface TransferItem {
  id: string;
  localPath: string;
  remotePath: string;
  type: 'upload' | 'download';
  status: 'pending' | 'active' | 'completed' | 'error';
  progress: number;
  error?: string;
}

@Component({
  selector: 'app-file-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-manager.component.html',
  styleUrls: ['./file-manager.component.css']
})
export class FileManagerComponent implements OnInit {
  localPath = '';
  remotePath = '/';
  localFiles: FileItem[] = [];
  remoteFiles: FileItem[] = [];
  selectedLocalFiles: Set<string> = new Set();
  selectedRemoteFiles: Set<string> = new Set();
  
  showConnectionDialog = false;
  isConnected = false;
  connectionConfig: ConnectionConfig = {
    protocol: 'ftp',
    host: '',
    port: 21,
    username: '',
    password: ''
  };

  transferQueue: TransferItem[] = [];
  statusMessage = 'Ready';

  constructor(public electronService: ElectronService) {}

  async ngOnInit() {
    if (this.electronService.isElectron) {
      // Set initial local path to user's home directory
      this.localPath = '/home/user';
    } else {
      // Set demo path for web version
      this.localPath = '/home/user';
    }
    await this.loadLocalFiles();
  }

  async loadLocalFiles() {
    try {
      this.localFiles = await this.electronService.getLocalFiles(this.localPath);
      this.selectedLocalFiles.clear();
    } catch (error) {
      console.error('Error loading local files:', error);
      this.statusMessage = `Error: ${error}`;
    }
  }

  async loadRemoteFiles() {
    if (!this.isConnected) return;
    
    try {
      this.remoteFiles = await this.electronService.getRemoteFiles(
        this.remotePath, 
        this.connectionConfig.protocol
      );
      this.selectedRemoteFiles.clear();
    } catch (error) {
      console.error('Error loading remote files:', error);
      this.statusMessage = `Error: ${error}`;
    }
  }

  async navigateLocal(path: string) {
    if (path === '..') {
      const parts = this.localPath.split('/');
      parts.pop();
      this.localPath = parts.join('/') || '/';
    } else {
      this.localPath = this.localPath.endsWith('/') ? 
        this.localPath + path : 
        this.localPath + '/' + path;
    }
    await this.loadLocalFiles();
  }

  async navigateRemote(path: string) {
    if (!this.isConnected) return;
    
    if (path === '..') {
      const parts = this.remotePath.split('/');
      parts.pop();
      this.remotePath = parts.join('/') || '/';
    } else {
      this.remotePath = this.remotePath.endsWith('/') ? 
        this.remotePath + path : 
        this.remotePath + '/' + path;
    }
    await this.loadRemoteFiles();
  }

  toggleLocalSelection(fileName: string) {
    if (this.selectedLocalFiles.has(fileName)) {
      this.selectedLocalFiles.delete(fileName);
    } else {
      this.selectedLocalFiles.add(fileName);
    }
  }

  toggleRemoteSelection(fileName: string) {
    if (this.selectedRemoteFiles.has(fileName)) {
      this.selectedRemoteFiles.delete(fileName);
    } else {
      this.selectedRemoteFiles.add(fileName);
    }
  }

  async selectLocalDirectory() {
    const path = await this.electronService.selectDirectory();
    if (path) {
      this.localPath = path;
      await this.loadLocalFiles();
    }
  }

  openConnectionDialog() {
    this.showConnectionDialog = true;
  }

  closeConnectionDialog() {
    this.showConnectionDialog = false;
  }

  async connect() {
    try {
      let result;
      if (this.connectionConfig.protocol === 'sftp') {
        result = await this.electronService.connectSftp({
          host: this.connectionConfig.host,
          port: this.connectionConfig.port,
          username: this.connectionConfig.username,
          password: this.connectionConfig.password
        });
      } else {
        result = await this.electronService.connectFtp({
          host: this.connectionConfig.host,
          port: this.connectionConfig.port,
          user: this.connectionConfig.username,
          password: this.connectionConfig.password
        });
      }

      if (result.success) {
        this.isConnected = true;
        this.statusMessage = result.message;
        this.closeConnectionDialog();
        await this.loadRemoteFiles();
      } else {
        this.statusMessage = result.message;
      }
    } catch (error) {
      this.statusMessage = `Connection failed: ${error}`;
    }
  }

  async disconnect() {
    try {
      await this.electronService.disconnect();
      this.isConnected = false;
      this.remoteFiles = [];
      this.statusMessage = 'Disconnected';
    } catch (error) {
      this.statusMessage = `Disconnect failed: ${error}`;
    }
  }

  async uploadFiles() {
    if (!this.isConnected || this.selectedLocalFiles.size === 0) return;

    for (const fileName of this.selectedLocalFiles) {
      const localFilePath = this.localPath.endsWith('/') ? 
        this.localPath + fileName : 
        this.localPath + '/' + fileName;
      const remoteFilePath = this.remotePath.endsWith('/') ? 
        this.remotePath + fileName : 
        this.remotePath + '/' + fileName;

      const transferItem: TransferItem = {
        id: Date.now().toString() + Math.random(),
        localPath: localFilePath,
        remotePath: remoteFilePath,
        type: 'upload',
        status: 'pending',
        progress: 0
      };

      this.transferQueue.push(transferItem);
      this.processTransfer(transferItem);
    }

    this.selectedLocalFiles.clear();
  }

  async downloadFiles() {
    if (!this.isConnected || this.selectedRemoteFiles.size === 0) return;

    for (const fileName of this.selectedRemoteFiles) {
      const remoteFilePath = this.remotePath.endsWith('/') ? 
        this.remotePath + fileName : 
        this.remotePath + '/' + fileName;
      const localFilePath = this.localPath.endsWith('/') ? 
        this.localPath + fileName : 
        this.localPath + '/' + fileName;

      const transferItem: TransferItem = {
        id: Date.now().toString() + Math.random(),
        localPath: localFilePath,
        remotePath: remoteFilePath,
        type: 'download',
        status: 'pending',
        progress: 0
      };

      this.transferQueue.push(transferItem);
      this.processTransfer(transferItem);
    }

    this.selectedRemoteFiles.clear();
  }

  private async processTransfer(item: TransferItem) {
    item.status = 'active';
    
    try {
      if (item.type === 'upload') {
        await this.electronService.uploadFile(
          item.localPath, 
          item.remotePath, 
          this.connectionConfig.protocol
        );
      } else {
        await this.electronService.downloadFile(
          item.remotePath, 
          item.localPath, 
          this.connectionConfig.protocol
        );
      }
      
      item.status = 'completed';
      item.progress = 100;
      
      // Refresh file lists
      await this.loadLocalFiles();
      await this.loadRemoteFiles();
      
    } catch (error) {
      item.status = 'error';
      item.error = error?.toString();
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }

  clearTransferQueue() {
    this.transferQueue = this.transferQueue.filter(item => 
      item.status === 'active' || item.status === 'pending'
    );
  }
}
