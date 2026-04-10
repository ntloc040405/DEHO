import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface CartItem {
  product: {
    _id: string;
    name: string;
    price: number;
    salePrice?: number | null;
    thumbnail: string;
  };
  quantity: number;
}

interface ShippingInfo {
  fullName: string;
  phone: string;
  address: string;
  note: string;
  shippingMethod: string;
  paymentMethod: string;
}

interface OrderData {
  cartItems: CartItem[];
  totalPrice: number;
  shippingInfo: ShippingInfo;
  orderNote: string;
  orderDate: string;
}

@Component({
  selector: 'app-donhang',
  templateUrl: './donhang.component.html',
  styleUrls: ['./donhang.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class DonhangComponent implements OnInit {
  order: OrderData | null = null;
  private apiUrl = 'http://localhost:4405/orders';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Lấy orderId từ query params
    const orderId = this.route.snapshot.queryParams['orderId'];
    if (orderId) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get(`${this.apiUrl}/${orderId}`, { headers }).subscribe({
        next: (response: any) => {
          if (response.success && response.data) {
            const data = response.data;
            // Ánh xạ dữ liệu từ API (items có productName và thumbnail trực tiếp)
            this.order = {
              cartItems: data.items.map((item: any) => ({
                product: {
                  _id: item.productId,
                  name: item.productName || 'Sản phẩm',
                  price: item.price,
                  salePrice: null,
                  thumbnail: item.thumbnail || '',
                },
                quantity: item.quantity,
              })),
              totalPrice: data.total,
              shippingInfo: {
                fullName: data.customerName,
                phone: data.customerPhone,
                address: data.customerAddress,
                note: data.customerNote,
                shippingMethod: 'free',
                paymentMethod: 'cod',
              },
              orderNote: data.customerNote,
              orderDate: data.createdAt,
            };
          }
        },
        error: (err) => {
          console.error('Error fetching order:', err);
          this.router.navigate(['/giohang']);
        },
      });
    } else {
      this.router.navigate(['/giohang']);
    }
  }
}