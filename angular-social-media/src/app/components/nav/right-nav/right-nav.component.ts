import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-right-nav',
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.css']
})
export class RightNavComponent implements OnInit {

  @Input()
  showUserInfo: boolean = true;

  paramsSub!: Subscription;

  constructor() { }

  ngOnDestroy(): void {
    // this.paramsSub.unsubscribe();
  }

  ngOnInit(): void {
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     this.showUserInfo = !this.router.url.includes('posts') && !this.router.url.endsWith('/');
    //   }
    // })
  }

}
