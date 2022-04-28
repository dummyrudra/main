import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageConatinerComponent } from './image-conatiner.component';

describe('ImageConatinerComponent', () => {
  let component: ImageConatinerComponent;
  let fixture: ComponentFixture<ImageConatinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageConatinerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageConatinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
