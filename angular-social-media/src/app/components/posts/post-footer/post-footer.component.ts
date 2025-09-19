import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from '../../../models/content';
import { Reaction } from '../../../models/reaction';
import { ContentService } from '../../../services/content.service';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'app-post-footer',
  templateUrl: './post-footer.component.html',
  styleUrls: ['./post-footer.component.css']
})
export class PostFooterComponent implements OnInit {

  @Input()
  post!: Post;

  @Input()
  showCancelLink: boolean = false;

  @Output()
  commentClickedEvent = new EventEmitter<boolean>();

  userReaction: Reaction | undefined;

  constructor(private userService: UserService, private contentService: ContentService) { }

  ngOnInit(): void {
    this.setUserReaction();
  }

  setUserReaction() {
    if (this.userHasReaction())
      this.userReaction = this.contentService.getUserReaction(this.post);
  }

  userHasReaction(): boolean {
    return this.contentService.userHasReaction(this.post);
  }

  commentClicked(event: Event): void {
    this.commentClickedEvent.emit(!this.showCancelLink);
  }

  reactionClicked(event: Event): void {

    this.userReaction = undefined;

    if (this.userHasReaction() && this.post && this.post.id) {
      let reactions: Reaction[] = this.post.reactions.filter(r => this.userService.activeUser && r.alias == this.userService.activeUser.alias);
      if (reactions.length == 1) {
        this.contentService.removeReactionFromPost(this.post.id, reactions[0].id).subscribe(() => {
          this.post.reactions = this.post.reactions.filter(r => r != reactions[0]);
          this.setUserReaction();
        });
      }
    }

    else if (this.post && this.post.id) {
        this.contentService.addReactionToPost(this.post.id, (event.target as Element).id).subscribe(r => {
          this.post.reactions.push(r);
          this.setUserReaction();
        });
    }
  }
}
