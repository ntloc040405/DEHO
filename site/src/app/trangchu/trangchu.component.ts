import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../product-interface';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { ListcardComponent } from '../listcard/listcard.component';

@Component({
  selector: 'app-trangchu',
  standalone: true,
  imports: [CommonModule, ListcardComponent],
  templateUrl: './trangchu.component.html',
  styleUrls: ['./trangchu.component.css']
})
export class TrangchuComponent implements OnInit {
  newProducts: ProductInterface[] = [];
  saleProducts: ProductInterface[] = []; // Thêm mảng cho sản phẩm sale
  hotProducts: ProductInterface[] = []; // Thêm mảng cho sản phẩm hot

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Lấy tất cả sản phẩm


    // Lấy sản phẩm mới
    this.productService.getNewProducts().subscribe({
      next: (data: any) => {
        console.log('Raw New Products:', data);
        console.log('Is array?', Array.isArray(data));
        this.newProducts = Array.isArray(data) ? data : (data.data || []);
        console.log('Assigned New Products:', this.newProducts);
      },
      error: (error) => {
        console.error('Error fetching new products:', error);
        this.newProducts = [];
      }
    });

    // Lấy sản phẩm sale
    this.productService.getSaleProducts().subscribe({
      next: (data: any) => {
        console.log('Raw Sale Products:', data);
        console.log('Is array?', Array.isArray(data));
        this.saleProducts = Array.isArray(data) ? data : (data.data || []);
        console.log('Assigned Sale Products:', this.saleProducts);
      },
      error: (error) => {
        console.error('Error fetching sale products:', error);
        this.saleProducts = [];
      }
    });

    this.productService.getHotProducts().subscribe({
      next: (data: any) => {
        console.log('Raw Hot Products:', data);
        this.hotProducts = Array.isArray(data) ? data : (data.data || []);
        console.log('Assigned Hot Products:', this.hotProducts);
      },
      error: (error) => {
        console.error('Error fetching hot products:', error);
        this.hotProducts = [];
      }
    });
  }

}
