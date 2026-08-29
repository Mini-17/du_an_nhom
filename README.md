# Book Showroom & Store

Một nền tảng web hiện đại kết hợp giữa **không gian trưng bày sách nghệ thuật (Virtual Showroom)** và **cửa hàng sách trực tuyến (E-commerce)**. Dự án được thiết kế theo phong cách Modern Editorial ấm cúng, tao nhã với tông màu mộc mạc của giấy và gỗ, mang lại trải nghiệm khám phá và mua sắm sách trực quan, thư thái.

---

## Tính năng nổi bật

### 1. Không gian trưng bày (Showroom Experience)
- **Virtual Bookshelf & Grid View:** Trưng bày sách theo bố cục thẻ thanh lịch, chuẩn tỉ lệ bìa sách.
- **Thematic Curations:** Bộ sưu tập tuyển chọn theo các chủ đề: Văn Học, Tâm Lý Học, Kinh Tế, Khoa Học, Thiếu Nhi, Lịch Sử...
- **Book Details Deep Dive:** Xem chi tiết thông số xuất bản, số trang, đánh giá sao, bình luận tương tác và sách liên quan.

### 2. Khám phá & Tìm kiếm thông minh
- **Faceted Search & Dynamic Filters:** Lọc đa chiều theo danh mục thể loại (kèm đếm số lượng thực tế), tác giả, khoảng giá tùy chỉnh và mức đánh giá sao.
- **Toggle Uncheck:** Cơ chế click chọn / click lại để bỏ lọc linh hoạt, tự động hiển thị lại toàn bộ sách.
- **Dynamic Pagination:** Phân trang gọn gàng 6 cuốn/trang, hỗ trợ cuộn mượt khi chuyển trang.

### 3. Thương mại điện tử & Cá nhân hóa
- **Shopping Cart Service:** Quản lý giỏ hàng lưu trữ bền vững qua `localStorage`, cập nhật số lượng và tổng tiền tức thì.
- **Checkout Flow:** Trải nghiệm thanh toán trực quan với Stepper Tracker 3 bước và tóm tắt đơn hàng chi tiết.
- **Hồ sơ cá nhân & Lịch sử đơn hàng:** Quản lý thông tin tài khoản và theo dõi trạng thái đơn mua.
- **Dark Mode toàn diện:** Chuyển đổi giao diện Sáng / Tối dịu mắt với hệ thống Design Tokens màu cà phê ấm.

---

## Thành viên nhóm:

- Nguyễn Hoàng Phúc - MSSV: 2551050174 - email: 2551050174phuc@ou.edu.vn
- Bùi Nguyệt Như - MSSV: 2551050166 - email: 2551050166nhu@ou.edu.vn
- Trần Quang Anh - MSSV: 2551050009 - email: 2551050009anh@ou.edu.vn

---

## Hệ màu & Giao diện (Design Tokens)

Dự án sử dụng **Tailwind CSS v4** với hệ thống token màu sắc chủ đạo theo phong cách Cozy Bookstore:

| Token | Light Mode | Dark Mode (`-invert`) | Công dụng |
| :--- | :--- | :--- | :--- |
| `--color-brand-600` | `#5C3B2E` | `#F7F3ED` | Nâu gỗ ấm: Logo, tiêu đề chính, thương hiệu |
| `--color-accent-500`| `#C9783A` | `#F59E0B` | Cam đất: Nút kêu gọi hành động (CTA), viền active, giá bán |
| `--color-surface` | `#F7F3ED` | `#1C1512` | Nền trang: Màu kem giấy mộc / Nâu than Espresso tối |
| `--color-surface-card` | `#FFFFFF` | `#261D19` | Nền thẻ Card nội dung, khung chi tiết sản phẩm |
| `--color-ink` | `#2F211B` | `#F7F3ED` | Màu chữ hiển thị chính: Đen nâu cà phê / Trắng kem giấy |
| `--color-muted` | `#76665C` | `#B3A59B` | Màu chữ phụ, mô tả, chú thích, ngày tháng |
| `--color-line` | `#DDD0C2` | `#3F312A` | Màu đường viền khung và vạch phân cách |

---

### Các bước cài đặt & Khởi chạy

```bash
git clone [https://github.com/Mini-17/du_an_nhom.git](https://github.com/Mini-17/du_an_nhom.git)
cd book-showroom
npm install
npm run dev