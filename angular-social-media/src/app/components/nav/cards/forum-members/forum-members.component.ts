import { Forum } from '../../../../models/forum';
import { User } from '../../../../models/user';
import { Component, OnInit, Input } from '@angular/core';
import { Utils } from '../../../../models/utils';

@Component({
  selector: 'app-forum-members',
  templateUrl: './forum-members.component.html',
  styleUrls: ['./forum-members.component.css']
})
export class ForumMembersComponent implements OnInit {

  @Input()
  forum!: Forum;

  constructor() { }

  ngOnInit(): void {
    this.forum.members = Utils.sortByAlias(this.forum.members);
  }

}
