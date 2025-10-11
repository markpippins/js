import { Utils } from './../../../models/utils';
import { ContentService } from '../../../services/content.service';
import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../../../models/content';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-post-container',
  templateUrl: './post-container.component.html',
  styleUrls: ['./post-container.component.css']
})
export class PostContainerComponent implements OnInit {

  @Input()
  post!: Post;

  hideCreatePost: boolean = true;

  constructor(private userService: UserService, private contentService: ContentService) { }

  ngOnInit(): void {
    this.post.replies.forEach(comment => comment.post = this.post);
    this.post.replies = Utils.reverseSortById(this.post.replies);
  }

  commentPosted(comment: string): void {
    this.toggleCreatePost();
      this.contentService.addCommentToPost(this.post.id, comment).subscribe(data => {
        data.post = this.post;
        this.post.replies.unshift(data);
      });
  }

  toggleCreatePost() {
    this.hideCreatePost = !this.hideCreatePost;
  }

  escapeClicked() {
    this.toggleCreatePost();
  }

  getPrompt(): string {
    return 'Say something...';
  }
}
