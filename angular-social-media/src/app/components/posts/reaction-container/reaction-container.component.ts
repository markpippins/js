import { Component, Input, OnInit } from '@angular/core';
import { Reaction } from 'src/app/models/reaction';
import { Content } from '../../../models/content';
import { ContentService } from '../../../services/content.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-reaction-container',
  templateUrl: './reaction-container.component.html',
  styleUrls: ['./reaction-container.component.css']
})
export class ReactionContainerComponent implements OnInit {

  @Input()
  content!: Content;

  // @Input()
  // showCancelLink: boolean = false;

  // @Output()
  // commentClickedEvent = new EventEmitter<boolean>();

  userReaction: Reaction | undefined;

  constructor(private contentService: ContentService, private userService: UserService) { }

  ngOnInit(): void {
    this.setUserReaction();
  }

  setUserReaction() {
    this.userReaction = undefined;
    try {
      this.userReaction = this.contentService.getUserReaction(this.content);
    }
    catch (error) {
      this.userReaction = undefined;
    }
  }

  userHasReaction(): boolean {
    return this.contentService.userHasReaction(this.content);
  }

  // commentClicked(event: Event): void {
  //   this.commentClickedEvent.emit(!this.showCancelLink);
  // }

  reactionClicked(event: Event): void {
    if (this.userHasReaction() && this.content && this.content.id) {
      let reactions: Reaction[] = this.content.reactions.filter(r => this.userService.activeUser && r.alias == this.userService.activeUser.alias);
      if (reactions.length == 1) {
        let reaction: Reaction = reactions[0];
        if (this.content instanceof Comment) {
          this.contentService.removeReactionFromComment(this.content.id, reaction.id).subscribe(() => {
            this.content.reactions = this.content.reactions.filter(r => r != reaction);
            this.setUserReaction();
          });
        }
      }
    }

    else if (this.content && this.content.id) {
      if (this.content instanceof Comment) {
        this.contentService.addReactionToComment(this.content.id, (event.target as Element).id).subscribe(r => {
          this.content.reactions.push(r);
          this.setUserReaction();
        });
      }
    }
  }

}
