import { Injectable } from '@angular/core';
import { UserService } from '../user.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private userService: UserService, private jwtService: JwtService) { }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    // return !this.jwtHelper.isTokenExpired(token);

    return this.userService.isLoggedIn();
  }
}
