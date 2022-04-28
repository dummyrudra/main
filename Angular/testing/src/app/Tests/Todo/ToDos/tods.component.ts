import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TodosService } from 'src/app/services/todos.service';

@Component({
  // providers: [TodosService],
  selector: 'todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class ToDosComponent implements OnInit {
  todos: any = [];
  message: string = '';
  constructor(private todosService: TodosService) {}

  ngOnInit() {
    // this.todosService.getTodos().subscribe((todos) => (this.todos = todos));
    this.todosService.getTodosPromise().then((result) => {
      this.todos = result;
    });
  }

  add() {
    var newTodo = { title: '...' };
    this.todosService.add(newTodo).subscribe(
      (todo) => this.todos.push(todo),
      (error) => {
        this.message = error;
      }
    );
  }

  deleteTodo(id: number) {
    if (confirm('Are you sure you want to delete this')) {
      this.todosService.delete(id).subscribe(
        (response) => {},
        (error) => {
          this.message = error;
        }
      );
    }
  }
}
