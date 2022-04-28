import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationTestComponent } from './integration-test.component';

describe('IntegrationTestComponent', () => {
  let component: IntegrationTestComponent;
  let fixture: ComponentFixture<IntegrationTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IntegrationTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
