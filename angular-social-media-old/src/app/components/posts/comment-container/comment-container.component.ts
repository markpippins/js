import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Comment } from '../../../models/content';
import { ContentService } from '../../../services/content.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-comment-container',
  templateUrl: './comment-container.component.html',
  styleUrls: ['./comment-container.component.css']
})
export class CommentContainerComponent implements OnInit {

  @Input()
  comment!: Comment;

  @Output()
  escapeEvent = new EventEmitter<boolean>();

  hideCreatePost: boolean = true;

  constructor(private userService: UserService, private contentService: ContentService) { }

  ngOnInit(): void {
    this.comment.replies.forEach(comment => comment.parent = this.comment);
  }

  hasReplies(): boolean {
    return this.comment.replies.length > 0;
  }

  replyPosted(text: string) {
    this.contentService.addReplyToComment(this.comment.id, text).subscribe(data => {
      data.parent = this.comment;
      this.comment.replies.push(data);
    });

    this.toggleCreatePost();
  }

  toggleCreatePost() {
    this.hideCreatePost = !this.hideCreatePost;
  }

  escapeClicked() {
    this.toggleCreatePost();
    this.escapeEvent.emit(this.hideCreatePost);
  }

  getPrompt(): string {
    return this.comment.postedBy;
  }
}
