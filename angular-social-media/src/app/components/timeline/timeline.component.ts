import { Post } from 'src/app/models/content';
import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Utils } from '../../models/utils';
import { ContentService } from '../../services/content.service';
import { ForumService } from './../../services/forum.service';
import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.css']
})

export class TimelineComponent implements OnInit {

  refreshTimeLineSubject: Subject<Post> = new Subject<Post>();

  paramsSub!: Subscription;

  pageUserName: string | undefined;
  pageForumId: number | undefined;

  user!: User;

  cache: Post[] = [];
  posts: Post[] = [];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private contentService: ContentService, private userService: UserService, private forumService: ForumService) {
    console.log('TimeLineComponent is constructed');
  }

  ngOnDestroy(): void {
    this.refreshTimeLineSubject.unsubscribe();
    this.paramsSub.unsubscribe();
    console.log('TimeLineComponent is destroyed');
  }

  ngOnInit(): void {

    this.paramsSub = this.activeRoute.params.subscribe(routeParams => {
      this.pageUserName = 'alias' in routeParams ? routeParams['alias'] : undefined;
      this.pageForumId = 'forumId' in routeParams ? routeParams['forumId'] : undefined;

      if (this.pageUserName) {
        if (this.userService.users.has(this.pageUserName)) {
          let user = this.userService.users.get(this.pageUserName);
          if (user)
            this.user = user;
          this.showPosts();
        }
        else {
          this.userService.getUserByAlias(this.pageUserName).subscribe(user => {
              this.user = user;
              this.showPosts();
          },
            err => {
              console.log('HTTP Error', err);
              // this.router.navigate(['NOT_FOUND']);
            },
            () => {
              console.log('HTTP request completed.')
            });
        }
      }
    });

    this.refreshTimeLineSubject.subscribe(post => {
      this.cache.push(post);
      this.showPosts();
    });

    this.initializeData();
  }

  initializeData() {
    this.contentService.getPosts().subscribe(posts => {
      this.cache = posts;
      this.showPosts();
    })
  }

  showPosts() {
    console.log('filtering ' + this.cache.length + 'posts...')
    console.log('diplaying ' + this.posts.length + 'posts...')
    if (this.pageForumId) {
      this.posts = Utils.reverseSortById(this.cache.filter(post => post.forumId && post.forumId == this.pageForumId));
    }
    else this.posts = Utils.reverseSortById(this.pageUserName == undefined ? this.cache.filter(post => post.postedTo == undefined && !post.forumId) :
      this.cache.filter(post => post.postedTo == this.pageUserName && !post.forumId));
  }

  postAdded(message: string) {

    if (this.pageUserName == undefined && this.pageForumId == undefined) {
      this.contentService.addPost(message).subscribe(post => {
        this.refreshTimeLineSubject.next(post);
      });
    }

    else if (this.pageForumId == undefined && this.pageUserName != undefined) {
      this.contentService.addPostTo(this.pageUserName, message).subscribe(post => {
        this.refreshTimeLineSubject.next(post);
      });
    }

    else if (this.pageForumId) {
      this.contentService.addPostToForum(this.pageForumId, message).subscribe(post => {
        this.refreshTimeLineSubject.next(post);
      });
    }

  }

  getPrompt(): string {
    return 'Start a Conversation';
  }
}
