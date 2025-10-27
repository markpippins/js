import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Comment, Content, Post } from '../models/content';
import { Reaction } from '../models/reaction';
import { User } from './../models/user';
import { AppConfigService } from './app-config.service';
import { httpOptions } from './constants';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ContentService implements OnInit {

  POSTS!: string;
  REPLIES!: string;

  constructor(private http: HttpClient, private userService: UserService, private appConfigService: AppConfigService) { console.log('ContentService is constructed');
    this.POSTS = this.appConfigService.hostURL + '/api/posts';
    this.REPLIES = this.appConfigService.hostURL + '/api/replies';
  }

  ngOnInit(): void {
    console.log("init");
  }

  getPosts() {
    return this.http.get<Post[]>(this.POSTS.concat('/all'));
  }

  getPostById(postId: number) {
    // return this.posts.find(post => post.id == postId) as Post;
    return this.http.get<Post[]>(this.POSTS.concat('/all/' + postId));
  }

  addPost(message: string): Observable<Post> {
    if (this.userService.activeUser) {
      let post = { postedBy: this.userService.activeUser.alias, postedTo: undefined, text: message };
      return this.http.post<Post>(this.POSTS.concat('/').concat('add'),
        post, httpOptions);
      // .pipe(
      //   catchError(this.handleError('addPost', post))
      // );
    }

    throw new Error('addPost() Called with no active user.');
  }

  addPostTo(postedTo: string, message: string): Observable<Post> {
    if (this.userService.activeUser) {
      let post = { postedBy: this.userService.activeUser.alias, postedTo: postedTo, text: message };
      return this.http.post<Post>(this.POSTS.concat('/').concat('add'),
        post, httpOptions);
      // .pipe(s
      //   catchError(this.handleError('addPostTo', post))
      // );
    }

    throw new Error('addPostTo() Called with no active user.');
  }

  addPostToForum(forumId: number, message: string): Observable<Post> {
    if (this.userService.activeUser) {
      let post = { postedBy: this.userService.activeUser.alias, text: message };
      return this.http.post<Post>(this.POSTS.concat('/forums/' + forumId).concat('/add'),
        post, httpOptions);
      // .pipe(s
      //   catchError(this.handleError('addPostToForum', post))
      // );
    }

    throw new Error('addPostToForum() Called with no active user.');
  }

  addCommentToPost(postId: number, message: string, parentId?: number): Observable<Comment> {
    if (this.userService.activeUser) {
      let comment = { postId: postId, postedBy: this.userService.activeUser.alias, text: message };
      return this.http.post<Comment>(this.REPLIES.concat('/').concat('add'),
        comment, httpOptions);
      // .pipe(s
      //   catchError(this.handleError('addCommentToPost', comment))
      // );
    }

    throw new Error('addCommentToPost() Called with no active user.');
  }

  addReplyToComment(parentId: number, message: string): Observable<Comment> {
    if (this.userService.activeUser) {
      let comment = { parentId: parentId, postedBy: this.userService.activeUser.alias, text: message };
      return this.http.post<Comment>(this.REPLIES.concat('/').concat('add'),
        comment, httpOptions);
    }

    throw new Error('addReplyToComment() Called with no active user.');
  }

  addReactionToPost(postId: number, type: string) {
    if (this.userService.activeUser) {
      let reaction = { 'alias': this.userService.activeUser.alias, 'type': type }
      return this.http.post<Reaction>(this.POSTS.concat('/' + postId).concat('/add/reaction'),
        reaction, httpOptions);
    }

    throw new Error('addReactionToPost() Called with no active user.');
  }

  removeReactionFromPost(postId: number, reactionId: number) {
    let reaction = { id: reactionId }
    return this.http.post<Reaction>(this.POSTS.concat('/' + postId).concat('/remove/reaction'),
      reaction, httpOptions);
  }

  addReactionToComment(commentId: number, type: string) {
    if (this.userService.activeUser) {
      let reaction = { 'alias': this.userService.activeUser.alias, 'type': type }
      return this.http.post<Reaction>(this.REPLIES.concat('/' + commentId).concat('/add/reaction'),
        reaction, httpOptions);
    }

    throw new Error('addReactionToComment() Called with no active user.');
  }

  removeReactionFromComment(commentId: number, reactionId: number) {
    let reaction = { id: reactionId }
    return this.http.post<Reaction>(this.REPLIES.concat('/' + commentId).concat('/remove/reaction'),
      reaction, httpOptions);
  }

  handleError(arg0: string, post: { postedBy: string; text: string; }): any {
    throw new Error('handleError() Method not implemented.');
  }


  static userHasReaction(user: User, content: Content): boolean {
    return content.reactions.filter(r => r.alias == user.alias).length == 1;
  }

  static getUserReaction(user: User, content: Content): Reaction {
    return content.reactions.filter(r => r.alias == user.alias)[0];
  }

  public userHasReaction(content: Content): boolean {
    if (this.userService.activeUser)
      return ContentService.userHasReaction(this.userService.activeUser, content);

    throw new Error('addReactionToComment() Called with no active user.');
  }

  public getUserReaction(content: Content): Reaction {
    if (this.userService.activeUser)
      return ContentService.getUserReaction(this.userService.activeUser, content);

    throw new Error('getUserReaction() Called with no active user.');
  }
}
