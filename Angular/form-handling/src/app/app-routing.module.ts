import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './admin/category/category.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductComponent } from './admin/product/product.component';
import { ChatsComponent } from './chats/components/chats/chats.component';
import { AlertMessageComponent } from './common/components/alert-message/alert-message.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NewCourseFormComponent } from './new-course-form/new-course-form.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { DummyPostsComponent } from './posts/posts.component';
import { ProductsComponent } from './product/product.component';
import { UserService } from './services/user.service';
import { AdminGuard } from './shared/admin.guard';
import { AuthGuard } from './shared/auth.guard';
import { PreventLoggedInGuard } from './shared/prevent-logged-in.guard';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: 'test',
    // pathMatch: 'full',
    loadChildren: () => import('./test/ngc.module').then((m) => m.NgcModule),
  },
  {
    path: 'users',
    children: [
      { path: '', component: UsersComponent, canActivate: [AuthGuard] },
      {
        path: 'profile/:id',
        component: UserProfileComponent,
        resolve: {
          userData: UserService,
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'signup',
        component: SignupFormComponent,
        canActivate: [PreventLoggedInGuard],
      },
      {
        path: 'login',
        component: LoginFormComponent,
        canActivate: [PreventLoggedInGuard],
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
        canActivate: [PreventLoggedInGuard],
      },
    ],
  },

  { path: '', pathMatch: 'full', component: HomeComponent },
  {
    path: 'oshop/admin/categories',
    component: CategoryComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'oshop/admin/products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'oshop/admin/products/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'oshop/admin/products',
    component: ProductComponent,
    canActivate: [AuthGuard, AdminGuard],
  },

  {
    path: 'oshop/products',
    component: ProductsComponent,
  },
  {
    path: 'oshop/shopping-carts',
    component: ShoppingCartComponent,
  },
  {
    path: 'chats',
    component: ChatsComponent,
    canActivate: [AuthGuard],
  },

  // { path: 'test', component: NewCourseFormComponent, canActivate: [AuthGuard] },
  // { path: 'posts', component: DummyPostsComponent, canActivate: [AuthGuard] },
  { path: '**', component: NotfoundComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
