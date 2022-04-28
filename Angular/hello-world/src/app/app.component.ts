import { Component } from '@angular/core';
import { FavoriteChangedEventArgs } from './favorite/favorite.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'hello-world';
  post={
    title:"Post title",
    isFavorite:false,
    likesCount:110
  }
  onFavoriteChanged(eventArgs:FavoriteChangedEventArgs) {
    console.log("Favorite Changed!",eventArgs);
    this.post.likesCount+=eventArgs.newValue?1:-1
    //  this.post.isFavorite = eventArgs.newValue;
  }
}

