import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  template: `
    Message: <input type="text" [formControl]="message">
  `
})

export class CreatePostComponent implements OnInit {

  @Input()
  prompt: string = "what's on your mind?"

  @Output()
  postEvent = new EventEmitter<string>();

  @Output()
  escapeEvent = new EventEmitter<string>();

  message = new FormControl('');

  constructor() { }

  ngOnInit(): void {
    // this.message.setValue(this.prompt);
  }

  submitPost(): void {
    if (this.message.value != null && this.message.value.length > 0) {
      this.postEvent.emit(this.message.value);
      this.message.setValue('');
    }
  }

  onEscape() {
    this.message.setValue('');
    this.escapeEvent.emit('');
  }

  onEnter() {
    this.submitPost();
  }
}
