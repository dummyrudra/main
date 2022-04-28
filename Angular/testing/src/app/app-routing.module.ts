import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { ToDosComponent } from './Tests/Todo/ToDos/tods.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersComponent } from './users/users.component';

export const routes: Routes = [
  { path: 'users', component: UsersComponent },
  { path: 'users/:id', component: UserDetailsComponent },
  { path: 'todos', component: ToDosComponent },
  { path: 'not-found', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
