import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UserService } from './../../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  template: `
    Alias: <input type="text" [formControl]="alias">
    Email: <input type="text" [formControl]="email">
    Password: <input type="text" [formControl]="password">
  `
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  alias = new FormControl('');
  email = new FormControl('');
  password = new FormControl('');

  ngOnInit(): void {
    // this.userService.userLoginEvent.subscribe((user: User) => {
    //   console.log('setting user to '.concat(user.alias));
    //   this.router.navigate([(user.alias)]);
    // });
  }

  ngOnDestroy() {
  }

  onLoginClick() {
    if (this.alias.value.length > 0)
      this.userService.login(this.alias.value);
    else alert('empty username')
  }
}
