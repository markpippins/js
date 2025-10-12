import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FileManagerComponent } from './components/file-manager/file-manager.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FileManagerComponent],
  template: `
    <div class="app-container">
      <app-file-manager></app-file-manager>
    </div>
  `,
  styles: [`
    .app-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {
  title = 'FileZilla Clone';
}
