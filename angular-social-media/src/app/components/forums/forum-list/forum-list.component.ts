import { Forum } from '../../../models/forum';
import { ForumService } from './../../../services/forum.service';
import { Component, OnInit } from '@angular/core';
import { Utils } from 'src/app/models/utils';

@Component({
  selector: 'app-forum-list',
  templateUrl: './forum-list.component.html',
  styleUrls: ['./forum-list.component.css']
})
export class ForumListComponent implements OnInit {

  forums: Forum[] = [];

  constructor(private forumService: ForumService) {

  }

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.initializeData();
  }

  initializeData() {
    this.forumService.getForums().subscribe(data => {
      this.forums = Utils.sortByName(data);
      // this.forums = data.sort((f1, f2) => {
      //   if (f1.name > f2.name)
      //     return 1;

      //   if (f1.name < f2.name)
      //     return -1;

      //   return 0;
      // });
    })
  }
}
