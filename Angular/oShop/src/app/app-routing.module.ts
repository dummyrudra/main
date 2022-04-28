import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { ProductsComponent } from './products/products.component';
import { AdminGuard } from './shared/admin.guard';
import { AuthGuard } from './shared/auth.guard';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'shopping-cart',
    component: ShoppingCartComponent,
  },
  {
    path: 'check-out',
    component: CheckoutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'order-success',
    component: OrderSuccessComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-orders',
    component: MyOrdersComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin/orders',
    component: AdminOrdersComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/products/new',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/products/:id',
    component: ProductFormComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
  {
    path: 'admin/products',
    component: AdminProductsComponent,
    canActivate: [AuthGuard, AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
