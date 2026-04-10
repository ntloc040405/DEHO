import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lichsudonhang.component.html',
  styleUrls: ['./lichsudonhang.component.css'],
})
export class lichsudonhangComponent implements OnInit {
  user: any = null;
  orders: any[] = [];
  loading = true;

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    if (!this.user) {
      this.router.navigate(['/dangnhap']);
    } else {
      this.loadOrders();
    }
  }

  loadOrders(): void {
    this.loading = true;
    this.userService.getOrders().subscribe(
      (response) => {
        const rawOrders = response.data || response;
        this.orders = rawOrders.map((order: any) => ({
          ...order,
          orderDateFormatted: new Date(order.createdAt).toLocaleDateString('vi-VN'),
          // Map tất cả items thay vì chỉ lấy cái đầu tiên
          displayItems: (order.items || []).map((item: any) => ({
            name: item.productName || 'Sản phẩm',
            qty: item.quantity,
            image: item.thumbnail || '/images/products/default.png'
          }))
        }));
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        console.error('Error loading orders:', error);
        if (error.status === 401 || error.status === 403) {
          this.router.navigate(['/dangnhap']);
        }
      }
    );
  }

  viewOrderDetails(orderId: string): void {
    // Sửa đường dẫn để khớp với DonhangComponent sử dụng queryParams
    this.router.navigate(['/donhang'], { queryParams: { orderId: orderId } });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Đã giao': case 'Đã hoàn thành': return 'status-completed';
      case 'Đã hủy': return 'status-cancelled';
      case 'Đang giao': return 'status-shipping';
      default: return 'status-pending';
    }
  }

  logout(): void {
    this.userService.clearUser();
    this.router.navigate(['/dangnhap']);
  }
}