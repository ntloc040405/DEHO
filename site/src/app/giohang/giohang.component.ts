import { Component, OnInit } from '@angular/core';
import { CartService, ProductInterface } from '../cart.service';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CartItem {
  product: ProductInterface;
  quantity: number;
}

@Component({
  imports: [FormsModule, CommonModule, RouterModule],
  selector: 'app-giohang',
  templateUrl: './giohang.component.html',
  styleUrls: ['./giohang.component.css'],
})
export class GiohangComponent implements OnInit {
  cartItems: CartItem[] = [];
  cartItemCount: number = 0;
  totalPrice: number = 0;
  orderNote: string = '';

  constructor(
    private cartService: CartService,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    // Không yêu cầu đăng nhập để xem giỏ hàng
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.cartItemCount = this.cartService.getCartItemCount();
      this.totalPrice = this.cartService.getTotalPrice();
    });
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  removeFromCart(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  checkout(): void {
    // Kiểm tra giỏ hàng trống
    if (this.cartItems.length === 0) {
      alert('Giỏ hàng trống. Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }

    // Lưu thông tin giỏ hàng vào localStorage
    const orderData = {
      cartItems: this.cartItems,
      totalPrice: this.totalPrice,
      orderNote: this.orderNote,
    };
    localStorage.setItem('pendingOrder', JSON.stringify(orderData));

    // Chuyển hướng đến checkout (sẽ kiểm tra đăng nhập ở CheckoutComponent)
    this.router.navigate(['/checkout']);
  }
}