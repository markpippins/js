import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionContainerComponent } from './reaction-container.component';

describe('ReactionContainerComponent', () => {
  let component: ReactionContainerComponent;
  let fixture: ComponentFixture<ReactionContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReactionContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
