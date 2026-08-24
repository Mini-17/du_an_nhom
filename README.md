# Book Showroom & Store

Một nền tảng web hiện đại kết hợp giữa **không gian trưng bày sách nghệ thuật (Virtual Showroom)** và **cửa hàng sách trực tuyến (E-commerce)**. Dự án được thiết kế theo phong cách Modern Editorial tối giản, sang trọng, mang lại trải nghiệm khám phá và mua sắm sách trực quan, mượt mà.

---

## Tính năng nổi bật

### 1. Không gian trưng bày (Showroom Experience)
- **Virtual Bookshelf & 3D Preview:** Trải nghiệm xem bìa sách 360° và lật đọc thử các trang mẫu (*Look Inside*).
- **Thematic Curations:** Bộ sưu tập tuyển chọn theo chủ đề độc đáo (Tư duy lập trình, Lịch sử, Cảm hứng sống, Nghệ thuật...).
- **Curator’s Note & Audio Intro:** Cảm nhận từ ban biên tập cùng đoạn audio đọc thử trích dẫn sách ngắn.

### 2. Khám phá & Tìm kiếm thông minh
- **Faceted Search:** Lọc đa chiều theo tác giả, thể loại, mức giá và định dạng (Bìa cứng, Bìa mềm, Ebook, Bản giới hạn).
- **Reading Vibe Matcher:** Gợi ý sách theo tâm trạng hoặc thời gian đọc sẵn có của người dùng.

### 3. Thương mại điện tử & Cá nhân hóa
- **Slide-over Cart:** Giỏ hàng trượt mượt mà, tính toán chi phí vận chuyển tức thì.
- **Kệ sách cá nhân (Wishlist / Reading List):** Phân loại danh sách *Muốn đọc*, *Đang đọc* và *Đã mua*.
- **Đánh giá & Trích dẫn:** Cho phép độc giả chia sẻ bài review và highlight các câu nói tâm đắc.
- **Hỗ trợ Dark Mode toàn diện:** Chuyển đổi giao diện Sáng / Tối dịu mắt với hệ thống Design Tokens tùy biến.

---

# Thành viên:

- Nguyễn Hoàng Phúc - MSSV: 2551050174 - email: 2551050174phuc@ou.edu.vn
- Bùi Nguyệt Như - MSSV: 2551050166 - email: 2551050166nhu@ou.edu.vn

---

## Hệ màu & Giao diện (Design Tokens)

Dự án sử dụng **Tailwind CSS v4** với hệ thống token màu sắc được thiết kế riêng:

| Thành phần | Light Mode | Dark Mode (`-invert`) | Công dụng |
| :--- | :--- | :--- | :--- |
| `--color-brand-600` | `#1C3F39` | `#34D399` | Màu thương hiệu chính (Xanh Deep Forest / Mint Glow) |
| `--color-accent-500`| `#D97706` | `#FBBF24` | Màu nhấn, nút kêu gọi hành động (Amber / Gold) |
| `--color-surface` | `#FAF8F5` | `#0F172A` | Màu nền chính (Trắng kem giấy sách / Slate tối) |
| `--color-ink` | `#18181B` | `#F4F4F5` | Màu chữ hiển thị chính |
| `--color-muted` | `#71717A` | `#A1A1AA` | Màu chữ phụ, mô tả, chú thích |
| `--color-line` | `#E4E4E7` | `#27272A` | Màu đường viền khung và phân cách |

---

### Các bước cài đặt

1. **Clone repository về máy:**
   ```bash
   git clone [https://github.com/Mini-17/du_an_nhom.git](https://github.com/Mini-17/du_an_nhom.git)
   cd book-showroom
