import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvosInfoComponent } from './convos-info.component';

describe('ConvosInfoComponent', () => {
  let component: ConvosInfoComponent;
  let fixture: ComponentFixture<ConvosInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvosInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvosInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
