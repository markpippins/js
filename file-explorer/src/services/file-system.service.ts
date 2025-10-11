import { Injectable } from '@angular/core';
import { FileSystemNode } from '../models/file-system.model';

@Injectable({
  providedIn: 'root',
})
export class FileSystemService {
  private readonly root: FileSystemNode = {
    name: 'C:',
    type: 'folder',
    children: [
      {
        name: 'Program Files',
        type: 'folder',
        modified: '2023-10-26',
        children: [
          { name: 'Angular', type: 'folder', modified: '2023-10-25', children: [] },
          { name: 'Node.js', type: 'folder', modified: '2023-09-11', children: [] },
        ],
      },
      {
        name: 'Users',
        type: 'folder',
        modified: '2023-10-27',
        children: [
          {
            name: 'Public',
            type: 'folder',
            modified: '2023-05-12',
            children: [
                { name: 'shared-document.txt', type: 'file', content: 'Public content', modified: '2023-05-12'},
            ],
          },
          {
            name: 'DefaultUser',
            type: 'folder',
            modified: '2023-10-27',
            children: [
              { name: 'Documents', type: 'folder', modified: '2023-10-27', children: [
                { name: 'project-notes.txt', type: 'file', content: 'Notes about the project.', modified: '2023-10-26' },
                { name: 'report.docx', type: 'file', content: 'Final report.', modified: '2023-10-25' },
              ]},
              { name: 'Downloads', type: 'folder', modified: '2023-10-26', children: [] },
              { name: 'Pictures', type: 'folder', modified: '2023-10-24', children: [
                { name: 'vacation.jpg', type: 'file', content: 'Image data', modified: '2023-10-22' },
                { name: 'family.png', type: 'file', content: 'Image data', modified: '2023-10-21' },
              ]},
            ],
          },
        ],
      },
      {
        name: 'Windows',
        type: 'folder',
        modified: '2023-08-01',
        children: [
          { name: 'System32', type: 'folder', modified: '2023-09-15', children: [] },
        ],
      },
      { name: 'boot.ini', type: 'file', content: 'Boot configuration', modified: '2023-07-19' },
      { name: 'pagefile.sys', type: 'file', content: 'System page file', modified: '2023-10-27' },
    ],
  };

  getNode(path: string[]): FileSystemNode | null {
    if (path.length === 0) {
      return this.root;
    }
    
    let currentNode: FileSystemNode | undefined = this.root;
    for (const segment of path) {
        if (currentNode?.type === 'folder' && currentNode.children) {
            currentNode = currentNode.children.find(child => child.name === segment);
        } else {
            return null;
        }
    }
    return currentNode || null;
  }

  getContents(path: string[]): FileSystemNode[] {
    const node = this.getNode(path);
    if (node && node.type === 'folder' && node.children) {
      return [...node.children].sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return a.name.localeCompare(b.name);
      });
    }
    return [];
  }
}
