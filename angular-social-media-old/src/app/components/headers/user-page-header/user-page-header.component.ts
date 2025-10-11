import { Component, Input, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-user-page-header',
  templateUrl: './user-page-header.component.html',
  styleUrls: ['./user-page-header.component.css']
})
export class UserPageHeaderComponent implements OnInit {

  @Input()
  user!: User;

  imageUrl: string = 'https://picsum.photos/id/237/320/240';

  constructor(private userService: UserService) { }

  ngOnInit(): void { }
}
