import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { NavTabsComponent } from './common/components/nav-tabs/nav-tabs.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { NavbarComponent } from './common/components/navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { UsersComponent } from './users/users.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { NewCourseFormComponent } from './new-course-form/new-course-form.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DummyPostsComponent } from './posts/posts.component';
import { PostsService } from './services/posts.service';
import { NotificationService } from './services/notification.service';
import { AppErrorHandler } from './common/app-error-handler';
import { AuthGuard } from './shared/auth.guard';
import { UserService } from './services/user.service';
import { AlertMessageComponent } from './common/components/alert-message/alert-message.component';
import { SanitizerUrlPipe } from './common/pipes/sanitize-url.pipe';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { FriendsCardComponent } from './common/components/friends-card/friends-card.component';
import { PostFormComponent } from './common/components/post-form/post-form.component';
import { ImageConatinerComponent } from './common/components/image-conatiner/image-conatiner.component';
import { PostsComponent } from './common/components/posts/posts.component';
import { CommonModule } from '@angular/common';
import { LikeComponent } from './common/components/like/like.component';
import { CommentFormComponent } from './common/components/comment-form/comment-form.component';
import { CommentsComponent } from './comments/comments.component';
import { ToggleCommentsComponent } from './common/components/toggle-comments/toggle-comments.component';
import { AuthService } from './shared/auth.service';
import { ClipboardModule } from 'ngx-clipboard';
import { ToastrModule } from 'ngx-toastr';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { ProductComponent } from './admin/product/product.component';
import { ProductCardComponent } from './common/components/product-card/product-card.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { ProductFilterComponent } from './product/product-filter/product-filter.component';
import { ProductsComponent } from './product/product.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ChatsComponent } from './chats/components/chats/chats.component';
import { FriendsListComponent } from './chats/components/friends-list/friends-list.component';
import { ChatsCardComponent } from './chats/components/chats-card/chats-card.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CategoryComponent } from './admin/category/category.component';
// import { QuillModule } from 'ngx-quill';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { ImageCropperModule } from 'ngx-image-cropper';
import { ChatFormComponent } from './chats/components/chats-card/chat-form/chat-form.component';

import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';

const config: SocketIoConfig = {
  url: environment.socketUrl, // socket server url;
  options: {
    transports: ['websocket'],
  },
};

@NgModule({
  declarations: [
    AppComponent,
    ContactFormComponent,
    NavTabsComponent,
    SignupFormComponent,
    LoginFormComponent,
    NavbarComponent,
    HomeComponent,
    UsersComponent,
    NotfoundComponent,
    NewCourseFormComponent,
    ForgetPasswordComponent,
    PostsComponent,
    AlertMessageComponent,
    SanitizerUrlPipe,
    UserProfileComponent,
    FriendsCardComponent,
    PostFormComponent,
    DummyPostsComponent,
    ImageConatinerComponent,
    LikeComponent,
    CommentsComponent,
    CommentFormComponent,
    ToggleCommentsComponent,
    ProductFormComponent,
    ProductComponent,
    ProductCardComponent,
    ProductFilterComponent,
    ProductsComponent,
    ShoppingCartComponent,
    ChatsComponent,
    FriendsListComponent,
    ChatsCardComponent,
    CategoryComponent,
    ChatFormComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ClipboardModule,
    ToastrModule.forRoot({
      maxOpened: 1,
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true,
      includeTitleDuplicates: true,
      autoDismiss: true,
    }),
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config),
    // QuillModule,
    NgxPaginationModule,
    NgxDatatableModule,
    LoadingBarHttpClientModule,
    LoadingBarRouterModule,
    LoadingBarModule,
    AngularEditorModule,
    ImageCropperModule,
    NgbModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      exclude: ['/api/not/show/loader'],
    }),
  ],
  providers: [
    AuthService,
    NotificationService,
    UserService,
    PostsService,
    Validators,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
