import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TodosService {
  url = environment.apiUrl + '/todos';
  constructor(private http: HttpClient) {}

  getTodos() {
    return this.http.get(this.url);
  }

  getTodosPromise(): Promise<object | undefined> {
    return this.http.get(this.url).toPromise();
  }

  add(newTodo: any) {
    return this.http.post(this.url, newTodo);
  }

  delete(id: number) {
    return this.http.delete(this.url + '/' + id);
  }
}
