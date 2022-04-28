import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { empty, Observable, Subject } from 'rxjs';

import { UserDetailsComponent } from './user-details.component';

class RouterStub {
  navigate(params: string) {}
}

class ActivatedRouteStub {
  private subject = new Subject();

  push(value: any) {
    this.subject.next(value);
  }

  get params() {
    return this.subject.asObservable();
  }
}

describe('UserDetailsComponent', () => {
  let component: UserDetailsComponent;
  let fixture: ComponentFixture<UserDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserDetailsComponent],
      providers: [
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect the user to users page after save()', () => {
    let router = TestBed.get(Router);

    let spy = spyOn(router, 'navigate');

    component.save();

    expect(spy).toHaveBeenCalledWith(['users']);
  });

  it('should navigate users to the not-found page when id=0', () => {
    let router = TestBed.get(Router);

    let spy = spyOn(router, 'navigate');

    let route: ActivatedRouteStub = TestBed.get(ActivatedRoute);
    route.push({ id: '0' });

    expect(spy).toHaveBeenCalledWith(['not-found']);
  });
});
