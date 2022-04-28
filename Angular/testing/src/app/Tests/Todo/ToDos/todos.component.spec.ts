import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TodosService } from 'src/app/services/todos.service';
import { ToDosComponent } from './tods.component';
import { empty, from, throwError } from 'rxjs';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

describe('Todos', () => {
  let component: ToDosComponent;
  let service: TodosService;

  let toDosComponent: ToDosComponent;
  let fixture: ComponentFixture<ToDosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(TodosService);

    fixture = TestBed.createComponent(ToDosComponent);
    toDosComponent = fixture.componentInstance;
    // service = fixture.debugElement.injector.get(TodosService);

    component = new ToDosComponent(service);
  });

  xit('should set todos property when the item returns from getTodos().', () => {
    let todos: any = [1, 2, 3];
    spyOn(service, 'getTodos').and.callFake(() => {
      return from([todos]);
    });

    component.ngOnInit();

    expect(component.todos).toBe(todos);
  });

  it('should call the server to save the changes when new todo item added.', () => {
    let spy = spyOn(service, 'add').and.callFake(() => {
      return empty();
    });

    component.add();

    expect(spy).toHaveBeenCalled();
  });

  it('should add new todo returned from the server.', () => {
    let todo = { id: 1 };

    spyOn(service, 'add').and.callFake(() => {
      return from([todo]);
    });

    component.add();

    expect(component.todos.indexOf(todo)).toBeGreaterThan(-1);
  });

  it('should set the message property if server returns an error.', () => {
    let error = 'An error message.';

    spyOn(service, 'add').and.callFake(() => {
      return throwError(error);
    });

    component.add();

    expect(component.message).toBe(error);
  });

  it('should call server to delete a todo if user confirms to delete.', () => {
    spyOn(window, 'confirm').and.callFake(() => {
      return true;
    });

    let spy = spyOn(service, 'delete').and.callFake(() => {
      return empty();
    });

    component.deleteTodo(1);
    expect(spy).toHaveBeenCalled();
  });

  it('should not call server to delete a todo if user confirms not to delete.', () => {
    spyOn(window, 'confirm').and.callFake(() => {
      return false;
    });

    let spy = spyOn(service, 'delete').and.callFake(() => {
      return empty();
    });

    component.deleteTodo(1);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should set the message property if server returns an error.', () => {
    let error = "couldn't delete.";
    spyOn(window, 'confirm').and.callFake(() => {
      return true;
    });

    let spy = spyOn(service, 'delete').and.callFake(() => {
      return throwError(error);
    });

    component.deleteTodo(1);
    expect(component.message).toBe(error);
  });

  // Integration tests........
  xit('should load todos from the server', () => {
    spyOn(service, 'getTodos').and.returnValue(from([[1, 2, 3]]));

    fixture.detectChanges();

    expect(toDosComponent.todos.length).toBe(3);
  });
  it('should load todos from the server getTodosPromise', async(() => {
    spyOn(service, 'getTodosPromise').and.returnValue(
      Promise.resolve([1, 2, 3])
    );

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(toDosComponent.todos.length).toBe(3);
    });
  }));
  it('should load todos from the server getTodosPromise with tick interval', fakeAsync(() => {
    spyOn(service, 'getTodosPromise').and.returnValue(
      Promise.resolve([1, 2, 3])
    );

    fixture.detectChanges();

    tick();

    expect(toDosComponent.todos.length).toBe(3);
  }));
});
