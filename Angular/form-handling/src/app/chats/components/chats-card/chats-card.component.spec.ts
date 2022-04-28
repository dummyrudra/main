import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatsCardComponent } from './chats-card.component';

describe('ChatsCardComponent', () => {
  let component: ChatsCardComponent;
  let fixture: ComponentFixture<ChatsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatsCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
