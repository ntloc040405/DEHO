import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../product.service';
import { CartService } from '../cart.service';
import { CommonModule } from '@angular/common';
import { ProductInterface } from '../cart.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterModule],
  selector: 'app-chitietsanpham',
  templateUrl: './chitietsanpham.component.html',
  styleUrls: ['./chitietsanpham.component.css'],
})
export class ChiTietSanPhamComponent implements OnInit {
  product: ProductInterface | null = null;
  quantity: number = 1;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
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

  isSaleProduct(product: ProductInterface | null): boolean {
    return !!product && product.salePrice != null && product.salePrice < product.price;
  }

  calculateDiscountPercentage(price: number, salePrice: number | null): number {
    if (salePrice == null || salePrice >= price) return 0;
    return Math.round(((price - salePrice) / price) * 100);
  }

  increaseQuantity(): void { this.quantity++; }
  decreaseQuantity(): void { if (this.quantity > 1) this.quantity--; }

  addToCart(): void {
    if (this.product) {
      const productToAdd: ProductInterface = { ...this.product };
      for (let i = 0; i < this.quantity; i++) {
        this.cartService.addToCart(productToAdd);
      }
    }
  }

  buyNow(): void {
    if (this.product) {
      this.addToCart();
      this.router.navigate(['/giohang']);
    }
  }
}