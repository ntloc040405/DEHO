# 🏠 Deho - Hế thống Thương mại Điện tử Nội thất (Fullstack)

Deho là nền tảng e-commerce chuyên biệt cho nội thất, được xây dựng bài bản với kiến trúc tách biệt Frontend & Backend, tích hợp hệ thống quản trị (Admin Dashboard) và Chat thời gian thực.

---

## 🛠 Thành phần dự án

Hệ thống bao gồm 3 phân hệ chính:
1.  **API (Backend):** Node.js & Express, MongoDB, Socket.io (Port `4405`)
2.  **Admin (Frontend):** Angular 19+, Dashboard quản lý đơn hàng & khách hàng (Port `4200`)
3.  **Site (Frontend):** Angular 19+, Trang mua sắm cho khách hàng (Port `62044`)

---

## 🚀 Hướng dẫn cài đặt nhanh (Dành cho cộng sự)

### 1. Chuẩn bị môi trường
Hãy đảm bảo máy bạn đã cài:
-   **Docker** & **Docker Desktop**
-   **Git**

### 2. Thiết lập cấu hình (QUAN TRỌNG)
Dự án sử dụng biến môi trường để bảo mật các thông tin nhạy cảm.
1.  Di chuyển vào thư mục `API/`:
    ```bash
    cd API
    ```
2.  Tạo file `.env` từ file mẫu:
    ```bash
    cp .env.example .env
    ```
3.  Mở file `.env` và thiết lập các biến sau:
    -   `SECRET_KEY`: Một chuỗi ký tự ngẫu nhiên để bảo mật Token.
    -   `EMAIL_USER`: Địa chỉ Gmail của bạn (dùng để gửi OTP).
    -   `EMAIL_PASS`: **Mật khẩu ứng dụng (App Password)** của Gmail (16 ký tự).

### 3. Khởi mạch hệ thống bằng Docker
Quay lại thư mục gốc của dự án và chạy:

```bash
docker compose up -d --build
```
*Lệnh này sẽ tự động tải thư viện, build image và khởi chạy toàn bộ 4 container (Database, API, Admin, Site).*

### 4. Nạp dữ liệu mẫu & Tài khoản Admin
Sau khi container chạy xong, hãy nạp dữ liệu mồi (Sản phẩm, Khách hàng mẫu):

```bash
docker exec -it deho-api npm run seed
```

---

---

## 🔐 Tính năng Bảo mật & Tài khoản

Hệ thống đã được thiết lập các tiêu chuẩn bảo mật cho thương mại điện tử:

### 1. Quên mật khẩu (OTP Flow)
- Quy trình 3 bước: Nhập Email -> Xác nhận OTP -> Đổi mật khẩu mới.
- **Bảo mật:** Server chỉ cho phép đổi mật khẩu sau khi mã OTP đã được xác thực thành công (trạng thái `isVerified`).
- **Mẹo:** Trong môi trường phát triển, bạn có thể xem mã OTP ngay tại Terminal bằng lệnh `docker compose logs -f api` (Mã hiện sau biểu tượng 🔑).

### 2. Đổi mật khẩu (Auth Flow)
- Người dùng đã đăng nhập có thể đổi mật khẩu tại trang **Thông tin cá nhân**.
- Yêu cầu mật khẩu cũ chính xác và tự động đăng xuất sau khi đổi thành công để bảo vệ tài khoản.

### 3. Tài khoản mặc định

| Vai trò | Email | Mật khẩu | Ứng dụng |
| :--- | :--- | :--- | :--- |
| **Quản trị viên** | `admin@deho.vn` | `admin123` | [Admin Board](http://localhost:4200) |
| **Khách hàng** | `customer@deho.vn` | `admin123` | [Trang bán hàng](http://localhost:62044) |

---

## 🏗 Liên kết hệ thống

-   **Trang bán hàng:** [http://localhost:62044](http://localhost:62044)
-   **Trang quản trị:** [http://localhost:4200](http://localhost:4200)
-   **API Server:** [http://localhost:4405](http://localhost:4405)

---

## 📋 Ghi chú cho lập trình viên

### Quản lý mã nguồn
-   **KHÔNG BAO GIỜ** commit file `.env` lên GitHub (Đã được cấu hình trong `.gitignore`).
-   Mọi thay đổi về cấu hình chung nên được cập nhật vào `.env.example`.

### Hệ thống Chat (Socket.io)
-   Hệ thống sử dụng ID cố định của Admin (`67e32d8b2157440b136ea729`) để đồng bộ kênh chat. Tránh thay đổi ID này trong Database trừ khi bạn cập nhật đồng loạt trong mã nguồn.

### Sửa đổi dữ liệu
-   Nếu bạn muốn thay đổi danh sách hàng hóa ban đầu, hãy sửa các file JSON trong thư mục `Data/` và chạy lại lệnh `seed`.

---
*Dự án được bảo mật và tối ưu hóa cho môi trường Docker.*
**DEHO TEAM**
