import { Component, Input } from '@angular/core';
import { ProductInterface } from '../product-interface';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-listcard',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './listcard.component.html',
  styleUrls: ['./listcard.component.css']
})
export class ListcardComponent {
  @Input() product!: ProductInterface; // Sửa từ data thành product, bỏ mảng
  @Input() data: ProductInterface[] = [];
  @Input() title ='';

  // Kiểm tra sản phẩm có phải sale không
  isSaleProduct(product: ProductInterface): boolean {
    return !!product.salePrice && product.salePrice > 0 && product.salePrice < product.price;
  }

  // Kiểm tra sản phẩm có phải mới không (trong 7 ngày)
  isNewProduct(createdAt: string | Date | undefined): boolean {
    if (!createdAt) return false;
    const created = new Date(createdAt);
    const now = new Date();
    const diffDays = (now.getTime() - created.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 7;
  }

  // Tính % giảm giá, đảm bảo salePrice là number
  calculateDiscountPercentage(price: number, salePrice: number): number {
    return Math.round(((price - salePrice) / price) * 100);
  }
}