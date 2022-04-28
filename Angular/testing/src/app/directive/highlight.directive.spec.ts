import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

@Component({
  template: `
    <p highlight="cyan">Second</p>
    <p highlight>First</p>
  `,
})
class DirectiveHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<DirectiveHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DirectiveHostComponent, HighlightDirective],
    });

    fixture = TestBed.createComponent(DirectiveHostComponent);
    fixture.detectChanges();
  });
  it('should highlight the first element with cyan', () => {
    let de = fixture.debugElement.queryAll(By.css('p'))[0];
    expect(de.nativeElement.style.backgroundColor).toBe('cyan');
  });
  it('should highlight the second element with default color', () => {
    let de = fixture.debugElement.queryAll(By.css('p'))[1];
    let directive = de.injector.get(HighlightDirective);
    expect(de.nativeElement.style.backgroundColor).toBe(directive.defaultColor);
  });
});
