import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../models/user';
import { AppConfigService } from './app-config.service';

// @Injectable()
@Injectable({
  providedIn: 'root'
})
export class UserService  implements OnDestroy {


  USERS!: string;

  users: Map<string, User> = new Map<string, User>();

  userLoginEvent: EventEmitter<User> = new EventEmitter<User>();

  public activeUser: User | undefined;


  constructor(private http: HttpClient, private router: Router, private appConfigService: AppConfigService) {

    console.log('UserService is constructed');

    this.USERS = this.appConfigService.hostURL + '/api/users';

    if (!this.activeUser && this.isLoggedIn()) {

      let id = sessionStorage.getItem('social.media.user.user.id') ? sessionStorage.getItem('social.media.user.user.id') : undefined;
      let alias = sessionStorage.getItem('social.media.user.user.alias') ? sessionStorage.getItem('social.media.user.user.alias') : undefined;
      let name = sessionStorage.getItem('social.media.user.user.name') ? sessionStorage.getItem('social.media.user.user.name') : undefined;
      let avatarUrl = sessionStorage.getItem('social.media.user.user.avatarUrl') ? sessionStorage.getItem('social.media.user.user.avatarUrl') : undefined;
      let email = sessionStorage.getItem('social.media.user.user.email') ? sessionStorage.getItem('social.media.user.user.email') : undefined;
      let profileImageUrl = sessionStorage.getItem('social.media.user.user.profileImageUrl:') ? sessionStorage.getItem('social.media.user.user.profileImageUrl:') : undefined;

      if (id && alias && name && avatarUrl && email) {
        this.activeUser = { 'id': +id, 'alias': alias, 'name': name, 'email': email, 'avatarUrl': avatarUrl }
      }
      else { this.logout(); }
    }
  }


  ngOnDestroy() {
    console.log('UserService is destroyed');
  }

  getUsers() {
    return this.http.get<User[]>(this.USERS.concat('/all'));
  }

  getUserByAlias(alias: string) {
    return this.http.get<User>(this.USERS.concat('/alias/' + alias));
  }


  // private handleError(error: HttpErrorResponse) {
  //   if (error.error instanceof ErrorEvent) {
  //     // A client-side or network error occurred. Handle it accordingly.
  //     alert('ErrorEvent ' + error.error.message);
  //     console.error('An error occurred:', error.error.message);
  //   }
  //   else {
  //     // The backend returned an unsuccessful response code.
  //     // The response body may contain clues as to what went wrong
  //     alert('Else ' + error.status + ':::' + error.error);
  //     // console.error( "Backend returned code" + ${error.status},  + body was: ${error.error});
  //   }
  //   // return an observable with a user-facing error message return
  //   throwError( 'Something bad happened; please try again later.'); };
  // }


  getUserById(id: number) {
    return this.http.get<User>(this.USERS.concat('/id/' + id));
  }

  login(alias: string) {
    console.log('login(' + alias + ') called');

    if (this.users.has(alias)) {
      console.log('user found in cache')
      let user = this.users.get(alias);
      if (user) {
        this.setUser(user);
      }
    }
    else {
      console.log('retrieving user...')
      this.getUserByAlias(alias).subscribe(user => {
        if (user) {
          console.log('user returned from back end')
          this.users.set(alias, user);
          this.setUser(user);
        }
      },
        err => {
          console.log('HTTP Error', err);
          this.router.navigate(['NOT_FOUND']);
        },
        () => {
          console.log('HTTP request completed.')
        });
    }
  }

  setUser(user: User) {

    this.activeUser = user;

    sessionStorage.setItem('social.media.user.loggedIn', 'true');
    sessionStorage.setItem('social.media.user.user.id', user.id.toString());
    sessionStorage.setItem('social.media.user.user.alias', user.alias);
    sessionStorage.setItem('social.media.user.user.name', user.name);
    sessionStorage.setItem('social.media.user.user.avatarUrl', user.avatarUrl);
    sessionStorage.setItem('social.media.user.user.email', user.email);

    this.userLoginEvent.emit(user);
  }

  logout() {
    this.activeUser = undefined;
    sessionStorage.clear();
    sessionStorage.setItem('social.media.user.loggedIn', 'false');
  }

  isLoggedIn(): boolean {
    //    return this.activeUser !== undefined;
    return sessionStorage.getItem('social.media.user.loggedIn') == 'true';
  }

  activeUserAlias(): string | null {
    //    return this.activeUser !== undefined;
    return sessionStorage.getItem('social.media.user.alias');
  }

}
