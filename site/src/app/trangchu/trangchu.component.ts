import { Component, OnInit } from '@angular/core';
import { ProductInterface } from '../product-interface';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ListcardComponent } from '../listcard/listcard.component';

@Component({
  selector: 'app-trangchu',
  standalone: true,
  imports: [CommonModule, RouterModule, ListcardComponent],
  templateUrl: './trangchu.component.html',
  styleUrls: ['./trangchu.component.css']
})
export class TrangchuComponent implements OnInit {
  newProducts: ProductInterface[] = [];
  saleProducts: ProductInterface[] = [];
  hotProducts: ProductInterface[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getNewProducts().subscribe({
      next: (data: any) => {
        this.newProducts = Array.isArray(data) ? data : (data.data || []);
      },
      error: () => { this.newProducts = []; }
    });

    this.productService.getSaleProducts().subscribe({
      next: (data: any) => {
        this.saleProducts = Array.isArray(data) ? data : (data.data || []);
      },
      error: () => { this.saleProducts = []; }
    });

    this.productService.getHotProducts().subscribe({
      next: (data: any) => {
        this.hotProducts = Array.isArray(data) ? data : (data.data || []);
      },
      error: () => { this.hotProducts = []; }
    });
  }
}
