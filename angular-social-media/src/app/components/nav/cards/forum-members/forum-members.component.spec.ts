import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumMembersComponent } from './forum-members.component';

describe('ForumMembersComponent', () => {
  let component: ForumMembersComponent;
  let fixture: ComponentFixture<ForumMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForumMembersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForumMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
