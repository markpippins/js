import { User } from '../../../../models/user';
import { Component, Input, OnInit } from '@angular/core';
import { UserService } from './../../../../services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  @Input()
  pageUserName: string | undefined;

  user!: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    if (this.pageUserName && this.userService.users.has(this.pageUserName)) {
      let user = this.userService.users.get(this.pageUserName);
      if (user)
        this.user = user;
    }
  }
}
