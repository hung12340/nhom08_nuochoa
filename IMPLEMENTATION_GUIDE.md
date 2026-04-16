# Tài Liệu Hướng Dẫn - Ba Trang Mới của Aromis

## 📋 Tổng Quan

Đã tạo thành công ba trang chính cho website Aromis:
1. **Đăng nhập / Đăng ký** (Login/Register)
2. **Liên hệ** (Contact)
3. **Lịch sử đơn hàng** (Order History)

Tất cả các trang đều tuân thủ thiết kế hệ thống (Design System) với:
- Bảng màu: Trắng (#F9F9F9), Đen (#1A1A1A), Vàng đồng (#D4AF37)
- Font: Playfair Display (tiêu đề), Montserrat (nội dung)
- Responsive design hoàn toàn

---

## 1. 🔐 Trang Đăng Nhập / Đăng Ký

### Đường dẫn
- **URL**: `/(auth)` hoặc `/` + chọn đăng nhập từ header
- **File**: `src/app/(auth)/page.tsx`

### Tính năng

#### Chế độ Đăng Nhập (Login)
- Form nhập Email và Mật khẩu
- Checkbox "Ghi nhớ tôi" (Remember me)
- Xác thực dữ liệu:
  - Email: Kiểm tra định dạng hợp lệ
  - Mật khẩu: Tối thiểu 6 ký tự
  - Hiển thị lỗi màu đỏ nếu không hợp lệ

#### Chế độ Đăng Ký (Register)
- Form nhập Họ và tên, Email, Mật khẩu, Xác nhận mật khẩu
- Xác thực:
  - Họ tên: Không được trống
  - Email: Kiểm tra định dạng
  - Mật khẩu: Tối thiểu 6 ký tự
  - Mật khẩu xác nhận: Phải trùng khớp
- Hiển thị lỗi chi tiết cho từng trường

#### Lưu trữ Dữ liệu
- Dữ liệu người dùng lưu trong `localStorage` với key `auth-storage`
- Giữ trạng thái đăng nhập ngay cả sau khi tải lại trang

### File Liên Quan
- **Store**: `src/store/authStore.ts`
  - `login(email, password, name)`: Đăng nhập
  - `register(email, password, name)`: Đăng ký
  - `logout()`: Đăng xuất
  - `validateEmail(email)`: Kiểm tra email
  - `getAuthState()`: Lấy thông tin đăng nhập
  - `saveAuthState(state)`: Lưu thông tin

### Giao Diện
- Hero header màu đen với logo "AROMIS"
- Form nằm giữa, dễ dàng sử dụng
- Nút chuyển đổi giữa Đăng Nhập / Đăng Ký
- Link quay về trang chủ

---

## 2. 📧 Trang Liên Hệ (Contact)

### Đường dẫn
- **URL**: `/contact`
- **File**: `src/app/contact/page.tsx`

### Tính năng

#### Thông Tin Liên Hệ
- 3 thẻ thông tin với icon:
  - **Email**: `info@aromis.com`
  - **Điện thoại**: `+84 (123) 456-789`
  - **Địa chỉ**: `123 Ngô Tất Tố, Hà Nội, Việt Nam`

#### Form Liên Hệ
- Nhập: Họ tên, Email, Chủ đề, Nội dung
- Xác thực:
  - Họ tên: Không được trống
  - Email: Kiểm tra định dạng
  - Chủ đề: Không được trống
  - Nội dung: Tối thiểu 10 ký tự
- Lưu tin nhắn vào `localStorage` với key `contact-messages`
- Thông báo thành công sau gửi

#### Bản Đồ Google Maps
- Nhúng Google Maps với vị trí cửa hàng
- Hiển thị full screen ở cột bên phải

### Giao Diện
- Hero header "Liên Hệ Với Chúng Tôi"
- 3 thẻ thông tin contact
- Form bên trái, bản đồ bên phải
- Responsive: Form trên, bản đồ dưới (trên mobile)

---

## 3. 📦 Trang Lịch Sử Đơn Hàng (Order History)

### Đường dẫn
- **URL**: `/order-history`
- **File**: `src/app/order-history/page.tsx`

### Tính năng

#### Yêu Cầu Đăng Nhập
- Chỉ người dùng đã đăng nhập mới xem được
- Nếu chưa đăng nhập, hiển thị thông báo + link đăng nhập

#### Danh Sách Đơn Hàng
- Hiển thị tất cả đơn hàng của người dùng
- Mỗi đơn hàng hiển thị:
  - Mã đơn: `ARM-001`, `ARM-002`, etc.
  - Ngày mua
  - Trạng thái (với badge màu):
    - 🟡 **Chờ xác nhận** (Vàng)
    - 🔵 **Đang giao** (Xanh)
    - 🟢 **Đã hoàn thành** (Xanh lá)
  - Tổng tiền

#### Chi Tiết Đơn Hàng
Khi click vào một đơn hàng, hiển thị:
- **Mã đơn & Ngày mua**
- **Danh sách sản phẩm**:
  - Tên sản phẩm
  - Số lượng
  - Giá đơn vị
  - Tổng tiền cho sản phẩm
- **Tổng tiền đơn hàng**
- **Timeline trạng thái** (Chờ xác nhận → Đang giao → Đã hoàn thành)

#### Dữ Liệu Mock
Trang có 3 đơn hàng mẫu sẵn:
```json
[
  {
    "orderId": "ARM-001",
    "purchaseDate": "2026-04-12",
    "status": "Đã hoàn thành",
    "totalAmount": 9000000,
    "items": [...]
  },
  // ... thêm 2 đơn hàng khác
]
```

### Lưu Trữ Dữ Liệu
- Dữ liệu lưu trong `localStorage` với key `order-history`
- Tự động khởi tạo dữ liệu mock lần đầu

### File Liên Quan
- **Store**: `src/store/orderStore.ts`
  - `getOrders()`: Lấy tất cả đơn hàng
  - `saveOrders(orders)`: Lưu đơn hàng
  - `addOrder(order)`: Thêm đơn hàng mới
  - `updateOrderStatus(orderId, status)`: Cập nhật trạng thái
  - `getOrderById(orderId)`: Lấy chi tiết đơn hàng
  - `initializeMockOrders()`: Khởi tạo dữ liệu mẫu

### Giao Diện
- Layout 2 cột (hoặc stack trên mobile):
  - **Cột trái**: Danh sách đơn hàng
  - **Cột phải**: Chi tiết đơn hàng
- Chọn đơn hàng → Xem chi tiết tức thì
- Timeline hiển thị trạng thái vận chuyển

---

## 🔗 Cách Truy Cập

### Từ Header
1. **Đăng nhập**: Click icon user → `/( auth)` 
2. **Liên hệ**: Click menu "Liên Hệ" → `/contact`
3. **Lịch sử đơn hàng**: Từ Footer hoặc đăng nhập → `/order-history`

### Direct URLs
```
http://localhost:3000/(auth)         # Đăng nhập/Đăng ký
http://localhost:3000/contact       # Liên hệ
http://localhost:3000/order-history # Lịch sử đơn hàng
```

### Trong App
```tsx
import Link from 'next/link';

// Liên kết
<Link href="/(auth)">Đăng Nhập</Link>
<Link href="/contact">Liên Hệ</Link>
<Link href="/order-history">Lịch Sử Đơn Hàng</Link>
```

---

## 💾 Quản Lý Dữ Liệu

### LocalStorage Keys
```
auth-storage           # User login info
contact-messages       # Contact form submissions
order-history          # Order data
```

### Xóa Dữ Liệu (Console)
```javascript
// Xóa tất cả
localStorage.clear();

// Xóa riêng từng mục
localStorage.removeItem('auth-storage');
localStorage.removeItem('contact-messages');
localStorage.removeItem('order-history');
```

---

## 🎨 Design System

### Màu Sắc
```
Nền chính: #F9F9F9  (Trắng ngà)
Text chính: #1A1A1A (Đen nhám)
Accent: #D4AF37     (Vàng đồng)
```

### Font Chữ
```
Tiêu đề: Playfair Display
Nội dung: Montserrat
```

### Lỗi & Validation
```
Lỗi: Màu đỏ (#EF4444)
Thành công: Màu xanh (#10B981)
```

---

## ⚙️ Chạy & Test

### Chạy Development Server
```bash
npm run dev
```

### Build Production
```bash
npm run build
npm start
```

### Test Các Trang
1. **Test Đăng Nhập**:
   - Vào `/(auth)` 
   - Thử nhập email/password sai → Xem lỗi
   - Nhập đúng → Đăng nhập thành công
   - Refresh trang → Vẫn còn đăng nhập

2. **Test Liên Hệ**:
   - Vào `/contact`
   - Thử gửi form trống → Xem lỗi
   - Gửi hợp lệ → Thấy thông báo thành công

3. **Test Lịch Sử Đơn Hàng**:
   - Chưa đăng nhập → Xem thông báo yêu cầu đăng nhập
   - Đăng nhập → Xem danh sách & chi tiết đơn hàng

---

## 📝 Ghi Chú Phát Triển

### Validation Rules
- Email: Phải có `@` và domain hợp lệ
- Password: Tối thiểu 6 ký tự
- Name/Message: Không được để trống

### Status Đơn Hàng
1. **Chờ xác nhận** (Initial) → 🟡 Vàng
2. **Đang giao** → 🔵 Xanh dương
3. **Đã hoàn thành** → 🟢 Xanh lá

### Mở Rộng Trong Tương Lai
- Thêm password recovery
- Integratebackend API thay localStorage
- Thêm email notification
- Theo dõi đơn hàng real-time

---

## 📞 Support

Nếu có vấn đề, kiểm tra:
1. Có key `auth-storage` trong localStorage không?
2. Có JavaScript errors không? (Mở DevTools)
3. Đã chạy `npm install` chưa?
4. Port 3000 có bị chiếm không?

---

**Tạo bởi**: GitHub Copilot  
**Ngày**: 2026-04-16  
**Version**: 1.0.0
