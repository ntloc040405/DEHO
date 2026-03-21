import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service'; // Thêm CartService
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../cart.service';

@Component({
  standalone: true, // Component standalone
  imports: [CommonModule],
  selector: 'app-chitietsanpham',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css'],
})
export class ChiTietSanPhamComponent implements OnInit {
  product: ProductInterface | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Thêm Router để điều hướng
    private productService: ProductService,
    private cartService: CartService // Inject CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (data: ProductInterface) => {
          this.product = data;
        },
        error: (err: any) => {
          console.error('Lỗi khi lấy chi tiết sản phẩm:', err);
        },
      });
    }
  }

  // Kiểm tra sản phẩm có giảm giá không
  isSaleProduct(product: ProductInterface | null): boolean {
    return !!product && product.salePrice != null && product.salePrice < product.price;
  }

  // Tính phần trăm giảm giá
  calculateDiscountPercentage(price: number, salePrice: number | null): number {
    if (salePrice == null || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  // Tăng số lượng
  increaseQuantity(): void {
    this.quantity++;
  }

  // Giảm số lượng
  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  // Thêm vào giỏ hàng
  addToCart(): void {
    if (this.product) {
      // Thêm sản phẩm vào giỏ hàng với số lượng đã chọn
      const productToAdd: ProductInterface = { ...this.product };
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(productToAdd);
      }
      alert(`Đã thêm ${this.quantity} ${this.product.name} vào giỏ hàng`);
    }
  }

  // Mua ngay
  buyNow(): void {
    if (this.product) {
      // Thêm sản phẩm vào giỏ hàng
      this.addToCart();
      // Điều hướng đến trang giỏ hàng
      this.router.navigate(['/giohang']);
    }
  }
}