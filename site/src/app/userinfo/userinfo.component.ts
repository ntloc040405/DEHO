import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-info',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css'],
})
export class UserInfoComponent implements OnInit {
  user: any = null;
  selectedFile: File | null = null;

  // Password change fields
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordError = '';
  passwordSuccess = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    this.user = userData ? JSON.parse(userData) : null;
    if (!this.user) {
      this.router.navigate(['/dangnhap']);
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  updateAvatar(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('avatar', this.selectedFile);
      this.userService.updateAvatar(formData).subscribe(
        (response) => {
          console.log('Update Avatar Response:', response);
          const updatedUser = response.data || response.user;
          this.userService.updateUser(updatedUser);
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.user = updatedUser;
          alert('Cập nhật avatar thành công!');
          this.router.navigate(['/']);
        },
        (error) => {
          console.error('Lỗi cập nhật avatar:', error);
          alert('Cập nhật avatar thất bại!');
        }
      );
    } else {
      alert('Vui lòng chọn một hình ảnh!');
    }
  }

  handleChangePassword(): void {
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = '❌ Vui lòng nhập đầy đủ các trường';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = '❌ Mật khẩu xác nhận không khớp';
      return;
    }

    if (this.newPassword.length < 6) {
      this.passwordError = '❌ Mật khẩu mới phải có ít nhất 6 ký tự';
      return;
    }

    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        this.passwordSuccess = '✅ Đổi mật khẩu thành công! Bạn sẽ được đăng xuất sớm...';
        // Xóa form
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        
        // Đăng xuất sau 2 giây
        setTimeout(() => {
          this.logout();
        }, 2000);
      },
      error: (err) => {
        this.passwordError = '❌ ' + (err.error?.message || 'Lỗi khi đổi mật khẩu');
      }
    });
  }

  logout(): void {
    this.userService.clearUser();
    this.router.navigate(['/dangnhap']);
  }
}