import { Component, ChangeDetectionStrategy, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSystemService } from '../../services/file-system.service';
import { FileSystemNode } from '../../models/file-system.model';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileExplorerComponent {
  private fileSystemService = inject(FileSystemService);

  currentPath = signal<string[]>([]);
  
  currentItems = computed(() => {
    return this.fileSystemService.getContents(this.currentPath());
  });

  currentPathString = computed(() => {
    return ['C:', ...this.currentPath()].join('\\');
  });

  canGoUp = computed(() => this.currentPath().length > 0);

  openItem(item: FileSystemNode): void {
    if (item.type === 'folder') {
      this.currentPath.update(path => [...path, item.name]);
    } else {
      // In a real app, you would handle file opening logic here
      alert(`Opening file: ${item.name}\nContent: ${item.content}`);
    }
  }

  goUp(): void {
    if (this.canGoUp()) {
      this.currentPath.update(path => path.slice(0, -1));
    }
  }

  navigateToPath(index: number): void {
    this.currentPath.update(path => path.slice(0, index));
  }
}
