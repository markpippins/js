import { Forum } from '../../../../models/forum';
import { ForumService } from './../../../../services/forum.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-forum-info',
  templateUrl: './forum-info.component.html',
  styleUrls: ['./forum-info.component.css']
})
export class ForumInfoComponent implements OnInit {

  @Input()
  pageForumId: number | undefined;

  name: string = '';
  forum!: Forum;


  constructor(private forumService: ForumService) {
  }

  ngOnInit(): void {
    if (this.pageForumId) {
      this.forumService.getForumById(this.pageForumId).subscribe(forum => this.forum = forum);
    }
  }
}

