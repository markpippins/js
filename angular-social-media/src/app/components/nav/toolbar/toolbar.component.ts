import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {

  user!: User | undefined;

  paramsSub !: Subscription;

  constructor(private router: Router, private activeRoute: ActivatedRoute, private userService: UserService) { console.log('Toolbar is constructed'); }

  ngOnDestroy(): void {
    this.userService.userLoginEvent.unsubscribe();
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(users => users.forEach(user => this.userService.users.set(user.alias, user)));

    this.userService.userLoginEvent.subscribe((user: User) => {
      console.log('setting user to '.concat(user.alias));

      this.user = user;
      this.router.navigate([(user.alias)]);
    });

    this.paramsSub = this.activeRoute.params.subscribe(routeParams => {
      this.user = this.userService.activeUser;
    });

  }

  onLoginClick() {
    this.router.navigate(['login']);
  }

  onLogoutClick() {
    this.user = undefined;
    this.userService.logout();
  }

  isLoggedIn(): boolean {
    return this.userService.activeUser !== undefined;
  }

}
