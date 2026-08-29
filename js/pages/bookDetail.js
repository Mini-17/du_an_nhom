import { BookService } from "../services/bookServices.js";
import { CartService } from "../services/cartService.js";
import { showToast } from "../modules/toast.js";

export async function initBookDetailPage() {
  const container = document.getElementById("book-detail-container");
  if (!container) return;

  // 1. Lấy ID sách từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id") || "bn-001";

  // 2. Lấy thông tin sách hiện tại và toàn bộ sách
  const [book, allBooks] = await Promise.all([
    BookService.getBookById(bookId),
    BookService.getAllBooks(),
  ]);

  if (!book) {
    container.innerHTML = `
      <div class="py-16 text-center text-muted dark:text-muted-invert">
        <p class="text-base font-bold">Không tìm thấy thông tin cuốn sách này.</p>
        <a href="showroom.html" class="mt-3 inline-block text-xs font-bold text-accent-600 hover:underline">Quay lại cửa hàng</a>
      </div>
    `;
    return;
  }

  // Đồng bộ Breadcrumb
  const catBreadcrumb = document.getElementById("breadcrumb-category");
  const titleBreadcrumb = document.getElementById("breadcrumb-title");
  if (catBreadcrumb) catBreadcrumb.textContent = book.category || "Sách";
  if (titleBreadcrumb) titleBreadcrumb.textContent = book.title;

  // Lọc 4 sách liên quan
  const relatedBooks = allBooks
    .filter((b) => b.id !== book.id && b.category === book.category)
    .slice(0, 4);

  // Nếu không đủ sách cùng thể loại thì lấy bù các sách khác
  if (relatedBooks.length < 4) {
    const remaining = allBooks
      .filter((b) => b.id !== book.id && !relatedBooks.some((r) => r.id === b.id))
      .slice(0, 4 - relatedBooks.length);
    relatedBooks.push(...remaining);
  }

  // 5. Danh sách bình luận mẫu (lưu trữ/đọc từ localStorage theo bookId)
  const COMMENT_KEY = `booknest_reviews_${book.id}`;
  let reviews = JSON.parse(localStorage.getItem(COMMENT_KEY)) || [
    {
      name: "Phan Anh Tuấn",
      time: "Một tuần trước",
      rating: 5,
      content: "Sách cực kỳ ý nghĩa, chất lượng in ấn tốt của NXB Trẻ. Giao hàng nhanh và đóng gói trong hộp carton rất ấm cúng và sạch sẽ."
    },
    {
      name: "Lê Thị Hồng Ngát",
      time: "Một tuần trước",
      rating: 5,
      content: "Văn phong giản dị nhưng thấm đẫm triết lý nhân sinh. Cuốn sách gối đầu giường của tôi."
    },
    {
      name: "Nguyễn Minh Triết",
      time: "Một tuần trước",
      rating: 4,
      content: "Rất thích phong cách phục vụ của BookNest, đóng gói cẩn thận có tặng kèm bookmark xinh xắn."
    }
  ];

  // 6. Tạo DocumentFragment để render tối ưu hiệu năng
  const fragment = document.createDocumentFragment();
  const wrapper = document.createElement("div");
  wrapper.className = "space-y-16 lg:space-y-20";

  wrapper.innerHTML = `
    <!-- PHẦN 1: HERO DETAIL KHỚP FIGMA -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
      
      <!-- Cột trái: Khung Bìa Sách Chuẩn Figma (5/12) -->
      <div class="lg:col-span-5 w-full">
        <div class="w-full aspect-4/5] sm:aspect-square lg:aspect-4/5 max-h-125 flex items-center justify-center rounded-3xl border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert p-6 sm:p-10 shadow-sm">
          <img 
            src="${book.cover}" 
            alt="${book.title}" 
            class="h-full max-h-95 w-auto aspect-2/3 object-cover rounded-xl shadow-2xl transition-transform duration-300 hover:scale-105"
            onerror="this.parentElement.innerHTML='<div class=\\'h-80 w-56 rounded-xl bg-line/60 dark:bg-surface-invert flex items-center justify-center font-bold text-muted dark:text-muted-invert shadow-md text-center p-4 text-xs\\'>${book.title}</div>'"
          />
        </div>
      </div>

      <!-- Cột phải: Thông Tin Chi Tiết (7/12) -->
      <div class="lg:col-span-7 flex flex-col justify-between">
        <div>
          <!-- Tag danh mục & Nhà xuất bản -->
          <div class="flex items-center gap-2 mb-2 text-xs">
            <span class="font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
              ${book.badge || "Sách Bán Chạy"}
            </span>
            <span class="text-muted dark:text-muted-invert">•</span>
            <span class="text-muted dark:text-muted-invert">Nhà xuất bản: <strong class="text-ink dark:text-ink-invert font-semibold">NXB Trẻ</strong></span>
          </div>

          <!-- Tên sách -->
          <h1 class="font-display text-3xl sm:text-4xl font-bold leading-tight text-ink dark:text-ink-invert">
            ${book.title}
          </h1>

          <!-- Tác giả -->
          <p class="mt-2 text-sm text-muted dark:text-muted-invert">
            Tác giả: <strong class="font-semibold text-ink dark:text-ink-invert">${book.author}</strong>
          </p>

          <!-- Đánh giá sao & lượt bán -->
          <div class="mt-4 flex flex-wrap items-center gap-3 border-b border-line dark:border-line-invert-light pb-4 text-xs">
            <span class="text-amber-500 text-sm">★★★★★</span>
            <span class="font-bold text-ink dark:text-ink-invert">${book.rating ? book.rating.toFixed(1) : "5.0"}</span>
            <span class="text-muted dark:text-muted-invert">(${book.reviewsCount || 124} đánh giá)</span>
            <span class="h-3 w-px bg-line dark:bg-line-invert-light"></span>
            <span class="text-muted dark:text-muted-invert">Đã bán ${book.sold || "1.2k"}</span>
          </div>

          <!-- Giá tiền & Giảm giá -->
          <div class="mt-5 flex items-baseline gap-3.5">
            <span class="font-display text-3xl sm:text-4xl font-bold text-accent-600 dark:text-accent-400 whitespace-nowrap">
              ${book.price.toLocaleString("vi-VN")} đ
            </span>
            <del class="text-sm sm:text-base text-muted dark:text-muted-invert whitespace-nowrap">
              ${book.originalPrice.toLocaleString("vi-VN")} đ
            </del>
            <span class="rounded-md bg-accent-500/10 px-2 py-0.5 text-xs font-bold text-accent-600 dark:text-accent-400 whitespace-nowrap">
              -${Math.round((1 - book.price / book.originalPrice) * 100)}%
            </span>
          </div>

          <!-- Đoạn mô tả ngắn gọn -->
          <p class="mt-4 text-xs sm:text-sm leading-relaxed text-muted dark:text-muted-invert line-clamp-3">
            "${book.description}"
          </p>

          <!-- Bảng thông số sách -->
          <div class="mt-6 rounded-2xl border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert px-5 py-3 text-xs space-y-2.5">
            <div class="flex justify-between py-1 border-b border-line/50 dark:border-line-invert-light">
              <span class="text-muted dark:text-muted-invert">Số trang</span>
              <span class="font-semibold text-ink dark:text-ink-invert">320 trang</span>
            </div>
            <div class="flex justify-between py-1 border-b border-line/50 dark:border-line-invert-light">
              <span class="text-muted dark:text-muted-invert">Ngôn ngữ</span>
              <span class="font-semibold text-ink dark:text-ink-invert">Tiếng Việt</span>
            </div>
            <div class="flex justify-between py-1">
              <span class="text-muted dark:text-muted-invert">Năm xuất bản</span>
              <span class="font-semibold text-ink dark:text-ink-invert">2026</span>
            </div>
          </div>
        </div>

        <!-- Cụm Nút Tăng Giảm & Thêm/Mua Ngay -->
        <div class="mt-8 flex flex-col sm:flex-row gap-3">
          <div class="flex h-11 items-center justify-between rounded-xl border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert sm:w-28 px-3 text-xs font-bold shadow-sm">
            <button type="button" id="qty-minus" class="w-6 h-full text-muted hover:text-ink text-base">-</button>
            <span id="qty-val">1</span>
            <button type="button" id="qty-plus" class="w-6 h-full text-muted hover:text-ink text-base">+</button>
          </div>
          <button type="button" id="btn-add-cart" class="h-11 flex-1 rounded-xl border-2 border-accent-500 px-5 font-bold text-accent-600 dark:text-accent-400 hover:bg-accent-500 hover:text-white transition text-xs flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            Thêm Vào Giỏ
          </button>
          <button type="button" id="btn-buy-now" class="h-11 flex-1 flex items-center justify-center rounded-xl bg-accent-500 px-5 font-bold text-white hover:bg-accent-600 active:bg-accent-700 transition text-xs shadow-sm">
            Mua Ngay
          </button>
        </div>
      </div>
    </div>

    <!-- PHẦN 2: TAB MÔ TẢ & ĐÁNH GIÁ KHÁCH HÀNG -->
    <div class="border-t border-line dark:border-line-invert-light pt-10">
      <div class="flex border-b border-line dark:border-line-invert-light gap-8 mb-8 text-sm font-bold">
        <button type="button" id="tab-desc-btn" class="pb-3 text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition">
          Mô Tả Sản Phẩm
        </button>
        <button type="button" id="tab-reviews-btn" class="pb-3 border-b-2 border-accent-500 text-ink dark:text-ink-invert">
          Đánh Giá Khách Hàng (${reviews.length})
        </button>
      </div>

      <!-- Tab Mô tả -->
      <div id="tab-desc-content" class="hidden text-sm leading-relaxed text-muted dark:text-muted-invert space-y-4">
        <p>${book.description}</p>
        <p>Mỗi trang sách là một bước đi chiêm nghiệm, được đóng gói kỹ lưỡng và chuyển đến tay bạn với tinh thần trân quý nhất từ BookNest.</p>
      </div>

      <!-- Tab Đánh giá -->
      <div id="tab-reviews-content" class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        <div class="lg:col-span-2 space-y-4">
          <div id="reviews-list" class="space-y-4">
            ${reviews
              .map(
                (rev) => `
              <div class="rounded-2xl border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert p-5 shadow-sm">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-[#E5D5C5] dark:bg-surface-invert text-[#5C3D2E] dark:text-accent-400 font-bold flex items-center justify-center text-xs">
                      ${rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 class="font-bold text-xs text-ink dark:text-ink-invert">${rev.name}</h4>
                      <span class="text-[10px] text-muted dark:text-muted-invert">${rev.time}</span>
                    </div>
                  </div>
                  <div class="text-amber-500 text-xs">${"★".repeat(rev.rating)}${"☆".repeat(5 - rev.rating)}</div>
                </div>
                <p class="mt-3 text-xs leading-relaxed text-muted dark:text-muted-invert">${rev.content}</p>
              </div>
            `
              )
              .join("")}
          </div>

          <!-- Form đánh giá mới -->
          <form id="comment-form" class="mt-6 rounded-2xl border border-line dark:border-line-invert-light bg-line/10 dark:bg-surface-invert/40 p-5 space-y-3">
            <h4 class="font-bold text-xs text-ink dark:text-ink-invert">Viết nhận xét của bạn</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input type="text" id="comment-name" placeholder="Họ và tên của bạn" required class="w-full rounded-lg border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert px-3 py-2 text-xs outline-none focus:border-accent-500 text-ink dark:text-ink-invert" />
              <select id="comment-rating" class="w-full rounded-lg border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert px-3 py-2 text-xs outline-none focus:border-accent-500 text-ink dark:text-ink-invert">
                <option value="5">★★★★★ (5 sao - Tuyệt vời)</option>
                <option value="4">★★★★☆ (4 sao - Rất tốt)</option>
                <option value="3">★★★☆☆ (3 sao - Bình thường)</option>
              </select>
            </div>
            <textarea id="comment-text" rows="3" placeholder="Cảm nhận của bạn về cuốn sách này..." required class="w-full rounded-lg border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert px-3 py-2 text-xs outline-none focus:border-accent-500 text-ink dark:text-ink-invert"></textarea>
            <button type="submit" class="px-5 py-2.5 rounded-card bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs transition shadow-sm">
              Gửi Đánh Giá
            </button>
          </form>
        </div>

        <!-- Box Cam Kết -->
        <div class="rounded-3xl border border-line dark:border-line-invert-light bg-[#F5EBE1]/70 dark:bg-line-invert p-6 space-y-4">
          <h4 class="font-display text-base font-bold text-brand-600 dark:text-ink-invert">Tại sao chọn BookNest?</h4>
          <div>
            <h5 class="text-xs font-bold text-ink dark:text-ink-invert mb-1">Sách chọn lọc chất lượng</h5>
            <p class="text-[11px] leading-relaxed text-muted dark:text-muted-invert">Chúng tôi cam kết 100% sách thật bản quyền từ các nhà xuất bản uy tín.</p>
          </div>
          <div>
            <h5 class="text-xs font-bold text-ink dark:text-ink-invert mb-1">Bảo vệ môi trường</h5>
            <p class="text-[11px] leading-relaxed text-muted dark:text-muted-invert">Đóng gói hoàn toàn bằng giấy Kraft bảo vệ môi trường, mang hơi thở ấm áp tự nhiên.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- PHẦN 3: SÁCH LIÊN QUAN -->
    <div class="border-t border-line dark:border-line-invert-light pt-10">
      <h2 class="font-display text-2xl font-bold text-ink dark:text-ink-invert mb-6">Sách Liên Quan</h2>
      <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        ${relatedBooks
          .map(
            (b) => `
          <article class="bg-surface dark:bg-line-invert border border-line dark:border-line-invert-light rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between group">
            <a href="book-detail.html?id=${b.id}" class="aspect-3/4 bg-line/20 dark:bg-surface-invert overflow-hidden flex items-center justify-center p-3">
              <img 
                src="${b.cover}" 
                alt="${b.title}" 
                class="w-full h-full object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-300"
                onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center font-bold text-xs text-muted dark:text-muted-invert text-center p-2\\'>${b.title}</div>'"
              />
            </a>
            <div class="p-4 flex flex-col gap-1 flex-1 justify-between">
              <div>
                <p class="text-[11px] text-muted dark:text-muted-invert">${b.author}</p>
                <h3 class="font-display text-xs font-bold text-ink dark:text-ink-invert leading-snug mt-0.5 line-clamp-1">
                  <a href="book-detail.html?id=${b.id}" class="hover:text-accent-600 transition">${b.title}</a>
                </h3>
                <div class="text-amber-500 text-[10px] mt-1">★★★★★</div>
              </div>
              <div class="mt-2 flex items-baseline gap-2">
                <span class="font-bold text-xs text-accent-600 dark:text-accent-400">${b.price.toLocaleString("vi-VN")} đ</span>
                <del class="text-[10px] text-muted dark:text-muted-invert">${b.originalPrice.toLocaleString("vi-VN")} đ</del>
              </div>
            </div>
          </article>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  fragment.appendChild(wrapper);
  container.innerHTML = "";
  container.appendChild(fragment);

  // Gắn sự kiện nút
  let quantity = 1;
  const qtyVal = document.getElementById("qty-val");

  document.getElementById("qty-minus")?.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      if (qtyVal) qtyVal.textContent = quantity;
    }
  });

  document.getElementById("qty-plus")?.addEventListener("click", () => {
    quantity++;
    if (qtyVal) qtyVal.textContent = quantity;
  });

  document.getElementById("btn-add-cart")?.addEventListener("click", () => {
    CartService.addItem(book, quantity);
  });

  document.getElementById("btn-buy-now")?.addEventListener("click", () => {
    CartService.addItem(book, quantity);
    window.location.href = "checkout.html";
  });

  // Chuyển Tab
  const tabDescBtn = document.getElementById("tab-desc-btn");
  const tabReviewsBtn = document.getElementById("tab-reviews-btn");
  const tabDescContent = document.getElementById("tab-desc-content");
  const tabReviewsContent = document.getElementById("tab-reviews-content");

  tabDescBtn?.addEventListener("click", () => {
    tabDescBtn.className = "pb-3 border-b-2 border-accent-500 text-ink dark:text-ink-invert";
    tabReviewsBtn.className = "pb-3 text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition";
    tabDescContent?.classList.remove("hidden");
    tabReviewsContent?.classList.add("hidden");
  });

  tabReviewsBtn?.addEventListener("click", () => {
    tabReviewsBtn.className = "pb-3 border-b-2 border-accent-500 text-ink dark:text-ink-invert";
    tabDescBtn.className = "pb-3 text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition";
    tabReviewsContent?.classList.remove("hidden");
    tabDescContent?.classList.add("hidden");
  });

  // Gửi Form bình luận
  const commentForm = document.getElementById("comment-form");
  commentForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("comment-name");
    const ratingInput = document.getElementById("comment-rating");
    const textInput = document.getElementById("comment-text");

    const newReview = {
      name: nameInput.value.trim(),
      time: "Vừa xong",
      rating: Number(ratingInput.value),
      content: textInput.value.trim()
    };

    reviews.unshift(newReview);
    localStorage.setItem(COMMENT_KEY, JSON.stringify(reviews));

    showToast("Cảm ơn bạn đã gửi đánh giá!");
    commentForm.reset();

    // Render lại danh sách đánh giá ngay lập tức
    const reviewsList = document.getElementById("reviews-list");
    if (reviewsList) {
      reviewsList.insertAdjacentHTML(
        "afterbegin",
        `
        <div class="rounded-2xl border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert p-5 shadow-sm">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-[#E5D5C5] dark:bg-surface-invert text-[#5C3D2E] dark:text-accent-400 font-bold flex items-center justify-center text-xs">
                ${newReview.name.charAt(0)}
              </div>
              <div>
                <h4 class="font-bold text-xs text-ink dark:text-ink-invert">${newReview.name}</h4>
                <span class="text-[10px] text-muted dark:text-muted-invert">${newReview.time}</span>
              </div>
            </div>
            <div class="text-amber-500 text-xs">${"★".repeat(newReview.rating)}${"☆".repeat(5 - newReview.rating)}</div>
          </div>
          <p class="mt-3 text-xs leading-relaxed text-muted dark:text-muted-invert">${newReview.content}</p>
        </div>
      `
      );
    }
  });
}