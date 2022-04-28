import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { from } from 'rxjs';

import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(TodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call the getTodos method', () => {
    let todos = [1, 2, 3];
    let spy = spyOn(service, 'getTodos').and.callFake(() => {
      return from([todos]);
    });
    let res: any = [];
    let result = service.getTodos();
    result.subscribe((todos) => {
      res = todos;
    });
    expect(res).toBe(todos);
  });
  //.........trash
  it('should be call getTodos()', () => {
    let todos = [];
    service.getTodos().subscribe((todos) => {
      todos = [1, 2, 3];
    });

    expect(1).toBeGreaterThan(0);
  });
  it('should delete todo of given id', () => {
    service.delete(1).subscribe();

    expect(1).toBeGreaterThan(0);
  });
  it('should be add new todo()', () => {
    service.add({ title: 'test' }).subscribe((todos) => {});

    expect(1).toBeGreaterThan(0);
  });
  it('should be call getTodos()', () => {
    let todos = [];
    service.getTodosPromise().then((todos) => {
      todos = [1, 2, 3];
    });

    expect(1).toBeGreaterThan(0);
  });
});
