import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Comment } from '../../../models/content';
import { Reaction } from '../../../models/reaction';
import { ContentService } from '../../../services/content.service';
import { UserService } from '../../../services/user.service';
@Component({
  selector: 'app-comment-footer',
  templateUrl: './comment-footer.component.html',
  styleUrls: ['./comment-footer.component.css']
})
export class CommentFooterComponent implements OnInit {

  @Input()
  comment!: Comment;

  @Input()
  showCancelLink: boolean = false;

  @Output()
  commentClickedEvent = new EventEmitter<boolean>();

  userReaction: Reaction | undefined;

  constructor(private contentService: ContentService, private userService: UserService) { }

  ngOnInit(): void {
    this.setUserReaction();
  }

  setUserReaction() {
    if (this.userHasReaction())
      this.userReaction = this.contentService.getUserReaction(this.comment);
  }

  userHasReaction(): boolean {
    return this.contentService.userHasReaction(this.comment);
  }

  commentClicked(event: Event): void {
    this.commentClickedEvent.emit(!this.showCancelLink);
  }

  reactionClicked(event: Event): void {

    this.userReaction = undefined;

    if (this.userHasReaction() && this.comment && this.comment.id) {
      let reactions: Reaction[] = this.comment.reactions.filter(r => this.userService.activeUser && r.alias == this.userService.activeUser.alias);
      if (reactions.length == 1) {
        this.contentService.removeReactionFromComment(this.comment.id, reactions[0].id).subscribe(() => {
          this.comment.reactions = this.comment.reactions.filter(r => r != reactions[0]);
          this.setUserReaction();
        });
      }
    }

    else if (this.comment && this.comment.id) {
      this.contentService.addReactionToComment(this.comment.id, (event.target as Element).id).subscribe(r => {
        this.comment.reactions.push(r);
        this.setUserReaction();
      });
    }
  }
}
