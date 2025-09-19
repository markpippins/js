import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private auth: AuthService, public router: Router) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      console.log('not authorized')
      // this.router.navigate(['login']);
      return false;
    }
    console.log('is authorized')
    return true;
  }
}
