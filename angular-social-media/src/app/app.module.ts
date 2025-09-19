import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarComponent } from './components/apps/calendar/calendar.component';
import { ForumListItemComponent } from './components/forums/forum-list-item/forum-list-item.component';
import { ForumListComponent } from './components/forums/forum-list/forum-list.component';
import { ForumPageComponent } from './components/forums/forum-page/forum-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { ConvosInfoComponent } from './components/nav/cards/convos-info/convos-info.component';
import { ForumInfoComponent } from './components/nav/cards/forum-info/forum-info.component';
import { ForumMembersComponent } from './components/nav/cards/forum-members/forum-members.component';
import { UserDashComponent } from './components/nav/cards/user-dash/user-dash.component';
import { UserInfoComponent } from './components/nav/cards/user-info/user-info.component';
import { FooterComponent } from './components/nav/footer/footer.component';
import { LeftNavComponent } from './components/nav/left-nav/left-nav.component';
import { LoginComponent } from './components/nav/login/login.component';
import { RightNavComponent } from './components/nav/right-nav/right-nav.component';
import { ToolbarComponent } from './components/nav/toolbar/toolbar.component';
import { CreatePostComponent } from './components/posts/create-post/create-post.component';
import { PostContainerComponent } from './components/posts/post-container/post-container.component';
import { PostFooterComponent } from './components/posts/post-footer/post-footer.component';
import { PostHeaderComponent } from './components/posts/post-header/post-header.component';
import { CommentContainerComponent } from './components/posts/comment-container/comment-container.component';
import { CommentFooterComponent } from './components/posts/comment-footer/comment-footer.component';
import { CommentHeaderComponent } from './components/posts/comment-header/comment-header.component';
import { CommentListComponent } from './components/posts/comment-list/comment-list.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { UserPageHeaderComponent } from './components/headers/user-page-header/user-page-header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { IonicModule } from '@ionic/angular';
import { ReactionContainerComponent } from './components/posts/reaction-container/reaction-container.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { APP_INITIALIZER } from '@angular/core';
import { AppConfigService } from './services/app-config.service';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    CreatePostComponent,
    ToolbarComponent,
    CommentContainerComponent,
    TimelineComponent,
    PostContainerComponent,
    LeftNavComponent,
    RightNavComponent,
    PostHeaderComponent,
    PostFooterComponent,
    CommentHeaderComponent,
    CommentFooterComponent,
    CommentListComponent,
    CalendarComponent,
    ForumPageComponent,
    ForumListComponent,
    ForumListItemComponent,
    FooterComponent,
    LoginComponent,
    UserInfoComponent,
    ForumInfoComponent,
    ForumMembersComponent,
    UserDashComponent,
    ConvosInfoComponent,
    UserPageHeaderComponent,
    PageNotFoundComponent,
    ReactionContainerComponent,
    PostListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      }
    }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {


}
