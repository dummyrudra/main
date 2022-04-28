import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterLinkWithHref, RouterOutlet, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';
import { ToDosComponent } from './Tests/Todo/ToDos/tods.component';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let routes: Routes = [{ path: 'todos', component: ToDosComponent }];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes(routes)],
      declarations: [AppComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'testing'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('testing');
  });

  xit('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain(
      'testing app is running!'
    );
  });

  it('should have  router outlet', () => {
    let de = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(de).not.toBeNull();
  });

  xit('should have link to todos page', () => {
    let debugElements = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );

    let index = debugElements.findIndex((de) => {
      console.log(de.properties['href']);
      return de.properties['href'] === 'todos';
    });

    fixture.detectChanges();
    expect(index).toBeGreaterThan(-1);
  });
});
