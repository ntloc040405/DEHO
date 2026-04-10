import { Routes } from '@angular/router';
import { LoginComponent } from './dangnhap/dangnhap.component';
import { ThongkeComponent } from './thongke/thongke.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { QuanlydanhmucComponent } from './quanlydanhmuc/quanlydanhmuc.component';
import { QuanlysanphamComponent } from './quanlysanpham/quanlysanpham.component';
import { QuanlynguoidungComponent } from './quanlynguoidung/quanlynguoidung.component';
import { QuanlydonhangComponent } from './quanlydonhang/quanlydonhang.component';
import { DonhangchitietComponent } from './donhangchitiet/donhangchitiet.component';
import { ChatComponent } from './chat/chat.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  
  // Các route yêu cầu Layout và Auth
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AdminAuthGuard],
    children: [
      { path: 'thongke', component: ThongkeComponent },
      { path: 'quanlydanhmuc', component: QuanlydanhmucComponent },
      { path: 'quanlysanpham', component: QuanlysanphamComponent },
      { path: 'quanlynguoidung', component: QuanlynguoidungComponent },
      { path: 'quanlydonhang', component: QuanlydonhangComponent },
      { path: 'order/:id', component: DonhangchitietComponent },
      { path: 'chat', component: ChatComponent },
    ]
  },

  { path: '**', redirectTo: '/login' },
];