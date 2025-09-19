import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/apps/calendar/calendar.component';
import { ForumListComponent } from './components/forums/forum-list/forum-list.component';
import { ForumPageComponent } from './components/forums/forum-page/forum-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { LoginComponent } from './components/nav/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { AuthGuardService as AuthGard } from './services/auth/auth-guard.service';


const routes: Routes = [
  { path: 'NOT_FOUND', component: PageNotFoundComponent },
  { path: 'login', component: LoginComponent },
  {
    path: '', component: TimelineComponent, canActivate: [AuthGard]

  },
  {
    path: 'posts', component: TimelineComponent, canActivate: [AuthGard]

  },
  {
    path: 'calendar', component: CalendarComponent, canActivate: [AuthGard]

  },
  {
    path: 'forums', component: ForumListComponent, canActivate: [AuthGard]

  },
  {
    path: 'forums/:forumId', component: ForumPageComponent, canActivate: [AuthGard]

  },
  {
    path: ':alias', component: HomePageComponent, canActivate: [AuthGard]

  },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
