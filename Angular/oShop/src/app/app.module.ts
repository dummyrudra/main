import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginComponent } from './login/login.component';
import { NavbarComponent } from './navbar/navbar.component';
import { ProductsComponent } from './products/products.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ProductFilterComponent } from './home/product-filter/product-filter.component';
import { ProductCardComponent } from './product-card/product-card.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    LoginComponent,
    NavbarComponent,
    ProductsComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
    ProductFilterComponent,
    ProductCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    DataTablesModule,
    NgxPaginationModule,
    NgxDatatableModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
