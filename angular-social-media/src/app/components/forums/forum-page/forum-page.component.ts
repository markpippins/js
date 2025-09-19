import { ForumService } from './../../../services/forum.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContentService } from '../../../services/content.service';
import { UserService } from '../../../services/user.service';
import { Forum } from '../../../models/forum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-forum-page',
  templateUrl: './forum-page.component.html',
  styleUrls: ['./forum-page.component.css']
})
export class ForumPageComponent implements OnInit {

  paramsSub!: Subscription;
  forum!: Forum;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private contentService: ContentService, private userService: UserService, private forumService: ForumService) { }

  ngOnDestroy(): void {
    this.paramsSub.unsubscribe();
  }
  ngOnInit(): void {
    this.paramsSub = this.activeRoute.params.subscribe(routeParams => {
      if ('forumId' in routeParams) {
        let forumId = routeParams['forumId'];
        this.forumService.getForumById(forumId).subscribe(forum => this.forum = forum);
      }
    });
  }
}
