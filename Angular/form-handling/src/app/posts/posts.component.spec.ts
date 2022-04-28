import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DummyPostsComponent } from './posts.component';

describe('DummyPostsComponent', () => {
  let component: DummyPostsComponent;
  let fixture: ComponentFixture<DummyPostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DummyPostsComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DummyPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
