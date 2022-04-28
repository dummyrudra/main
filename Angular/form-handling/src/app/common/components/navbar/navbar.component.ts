import { Component, OnInit } from '@angular/core';
import jwtDecode from 'jwt-decode';
import { BehaviorSubject } from 'rxjs';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';
import { SocketService } from 'src/app/services/socket.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../../shared/auth.service';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  imageUrl: string;
  currentUser: any;
  navBarBackground: string;
  isOShop: boolean = false;
  public isMenuCollapsed = true;

  constructor(
    public auth: AuthService,
    private socket: SocketService,
    public cartService: ShoppingCartService
  ) {
    this.navBarBackground = environment.navBarBackground;
    this.imageUrl = environment.imageUrl;
  }

  ngOnInit(): void {
    this.auth.cast.subscribe((v) => {
      this.currentUser = this.auth.getDecodedAccessToken(v);
    });

    let cart$ = this.cartService.getCart();
    cart$.subscribe((cart) => {
      this.cartService.shoppingCartItemCount.next(0);
      for (let item of JSON.parse(JSON.stringify(cart)).items)
        this.cartService.shoppingCartItemCount.next(
          this.cartService.shoppingCartItemCount.getValue() + item?.quantity
        );
    });

    // this.currentUser = this.auth.getLoggedInUser();
  }

  ngDoCheck(): void {
    // this.currentUser = this.auth.getLoggedInUser();
  }
  stringToHslColor(str: string) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    var h = hash % 360;
    return 'hsl(' + h + ', ' + 40 + '%, ' + 20 + '%)';
  }

  shortName(name: string) {
    name = name?.toUpperCase();
    if (name?.indexOf(' ') === -1) return name?.slice(0, 2);
    return name[1] + name?.split(' ')[1][1];
  }
}
