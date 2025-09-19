import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

  paramsSub!: Subscription;

  constructor(private activeRoute: ActivatedRoute, private router: Router) { }

  ngOnDestroy(): void {
    // this.paramsSub.unsubscribe();
  }

  ngOnInit(): void {
    // this.paramsSub = this.activeRoute.params.subscribe(routeParams => { };
  }
}
