import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-left-nav',
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.css']
})
export class LeftNavComponent implements OnInit {

  @Input()
  pageUserName: string | undefined;

  @Input()
  pageForumId: number | undefined;


  constructor(private userService: UserService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  isUserPage() {
    return this.userService.activeUser && this.userService.activeUser.alias == this.pageUserName;
  }

  isConversationsPage() {
    return this.pageUserName == undefined && this.pageForumId == undefined;
  }
}
