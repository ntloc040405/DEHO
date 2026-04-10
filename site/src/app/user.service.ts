import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'http://localhost:4405/users';
  private readonly apiUrlT = 'http://localhost:4405';
  private readonly userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userSubject.next(JSON.parse(userData));
    }
  }

  // Đăng ký
  register(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData);
  }

  // Đăng nhập
  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Cập nhật avatar
  updateAvatar(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.put(`${this.apiUrl}/profile`, formData, { headers });
  }

  // Quản lý user trong context
  updateUser(user: any): void {
    this.userSubject.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearUser(): void {
    this.userSubject.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value || !!localStorage.getItem('token');
  }

  // Kiểm tra phiên làm việc để xóa dữ liệu ảo nếu DB bị reset
  validateSession(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get(`${this.apiUrlT}/users/me`, { headers }).subscribe({
        next: (res: any) => {
          if (res.success && res.data) {
            this.updateUser(res.data);
          } else {
            this.clearUser();
          }
        },
        error: () => {
          this.clearUser();
        }
      });
    } else {
      this.clearUser();
    }
  }

  // Lấy đơn hàng người dùng
  getOrders(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.get(`${this.apiUrlT}/orders/user`, { headers });
  }

  // ✅ Bổ sung các hàm Quên mật khẩu

  // 1. Gửi OTP về email
  sendOtp(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email });
  }

  // 2. Xác minh mã OTP
  verifyOtp(email: string, otp: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/verify-otp`, { email, otp });
  }

  // 3. Đặt lại mật khẩu mới
  resetPassword(email: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { email, newPassword });
  }

  // 4. Đổi mật khẩu (khi đang đăng nhập)
  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/change-password`, { oldPassword, newPassword }, { headers });
  }
}
