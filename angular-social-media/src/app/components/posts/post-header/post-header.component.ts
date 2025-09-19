import { User } from './../../../models/user';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from './../../../services/user.service';
import { Post } from '../../../models/content';

@Component({
  selector: 'app-post-header',
  templateUrl: './post-header.component.html',
  styleUrls: ['./post-header.component.css']
})
export class PostHeaderComponent implements OnInit {

  @Input()
  post!: Post;

  postedBy!: User | undefined;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    if (this.userService.users.has(this.post.postedBy)) {
      this.postedBy = this.userService.users.get(this.post.postedBy);
    }

  }

}
