export interface product {
  title: string;
  price: number;
  category: {
    _id: string;
    name: string;
  };
  imageUrl: string;
}
