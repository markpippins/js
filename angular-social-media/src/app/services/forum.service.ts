import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Forum } from '../models/forum';
import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ForumService {

  FORUMS!: string;

  constructor(private http: HttpClient, private appConfigService: AppConfigService) {
    this.FORUMS = this.appConfigService.hostURL + '/api/forums';
  }

  getForums() {
    return this.http.get<Forum[]>(this.FORUMS.concat('/all'));
  }

  getForumById(id: number) {
    return this.http.get<Forum>(this.FORUMS.concat('/id/' + id));
  }

}
