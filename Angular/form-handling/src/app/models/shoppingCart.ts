import { ShoppingCartItems } from './shoppingCartItem';

export class ShoppingCart {
  constructor(private items: ShoppingCartItems) {}
  get totalItemsCount(): number {
    let count = 0;
    for (let item of JSON.parse(JSON.stringify(this.items)))
      count += item?.quantity;
    return count;
  }
}
