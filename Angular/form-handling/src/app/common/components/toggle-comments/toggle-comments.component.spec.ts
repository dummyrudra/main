import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCommentsComponent } from './toggle-comments.component';

describe('ToggleCommentsComponent', () => {
  let component: ToggleCommentsComponent;
  let fixture: ComponentFixture<ToggleCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToggleCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
