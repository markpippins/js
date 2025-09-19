import { Component, Input, OnInit } from '@angular/core';
import { Comment } from '../../../models/content';
import { Utils } from '../../../models/utils';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.css']
})
export class CommentListComponent implements OnInit {

  @Input()
  replies!: Comment[];

  constructor() { }

  ngOnInit(): void {
  }

  getReplies() {
    return this.replies ? Utils.sortById(this.replies) : [];
  }
}
