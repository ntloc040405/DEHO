import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
  salePrice?: number | null;
  createdAt?: string | Date;
  thumbnail: string;
  categoryId: {
    _id: string;
    name: string;
  };
  description: string;
}

interface CartItem {
  product: ProductInterface;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  private loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartItems = JSON.parse(savedCart);
      this.cartItemsSubject.next(this.cartItems);
    }
  }

  private saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }

  addToCart(product: ProductInterface) {
    const existingItem = this.cartItems.find((item) => item.product._id === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cartItems.push({ product, quantity: 1 });
    }
    this.saveCartToLocalStorage();
  }

  updateQuantity(productId: string, quantity: number) {
    const item = this.cartItems.find((item) => item.product._id === productId);
    if (item && quantity > 0) {
      item.quantity = quantity;
      this.saveCartToLocalStorage();
    } else if (item && quantity === 0) {
      this.removeFromCart(productId);
    }
  }

  removeFromCart(productId: string) {
    this.cartItems = this.cartItems.filter((item) => item.product._id !== productId);
    this.saveCartToLocalStorage();
  }

  getTotalPrice(): number {
    return this.cartItems.reduce(
      (total, item) => total + (item.product.salePrice || item.product.price) * item.quantity,
      0
    );
  }

  getCartItemCount(): number {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0);
  }

  clearCart() {
    this.cartItems = [];
    this.saveCartToLocalStorage();
  }
}