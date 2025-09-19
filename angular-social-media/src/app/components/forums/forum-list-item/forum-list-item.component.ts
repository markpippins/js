import { Forum } from '../../../models/forum';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-forum-list-item',
  templateUrl: './forum-list-item.component.html',
  styleUrls: ['./forum-list-item.component.css']
})
export class ForumListItemComponent implements OnInit {

  @Input()
  forum!: Forum;

  constructor() { }

  ngOnInit(): void {
  }

}
