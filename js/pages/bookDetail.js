import { BookService } from "../services/bookServices.js";
import { CartService } from "../services/cartService.js";

export async function initBookDetailPage() {
  const container = document.getElementById("book-detail-container");
  if (!container) return;

  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get("id") || "bn-001";

  const book = await BookService.getBookById(bookId);
  if (!book) {
    container.innerHTML = `
      <div class="py-16 text-center text-muted dark:text-muted-invert">
        <p class="text-base font-bold">Không tìm thấy thông tin cuốn sách này.</p>
        <a href="showroom.html" class="mt-3 inline-block text-xs font-bold text-accent-600 hover:underline">Quay lại cửa hàng</a>
      </div>
    `;
    return;
  }

  // Cập nhật Breadcrumb động
  const catBreadcrumb = document.getElementById("breadcrumb-category");
  const titleBreadcrumb = document.getElementById("breadcrumb-title");
  if (catBreadcrumb) catBreadcrumb.textContent = book.category || "Sách";
  if (titleBreadcrumb) titleBreadcrumb.textContent = book.title;

  // Render bằng DocumentFragment
  const fragment = document.createDocumentFragment();
  const wrapper = document.createElement("div");
  wrapper.className = "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start";
  
  wrapper.innerHTML = `
    <!-- Cột 1: Ảnh bìa -->
    <div class="w-full max-w-180px sm:max-w-260px mx-auto lg:mx-0">
  <div class="flex aspect-3/4 items-center justify-center rounded-2xl border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert p-4 sm:p-5 shadow-sm overflow-hidden">
    <img
      src="${book.cover}"
      alt="${book.title}"
      class="h-full w-full object-cover rounded-xl shadow-md"
      onerror="this.parentElement.innerHTML='<div class=\\'h-full w-full rounded-xl bg-line/60 dark:bg-surface-invert flex items-center justify-center font-bold text-muted dark:text-muted-invert shadow-md text-center p-4 text-xs\\'>${book.title}</div>'"
    />
  </div>
</div>

    <!-- Cột 2: Thông tin chi tiết -->
    <div class="flex flex-col">
      <span class="inline-block self-start mb-2 text-[11px] font-bold uppercase tracking-wider text-accent-600 dark:text-accent-400">
        ${book.badge || "Sách chọn lọc"}
      </span>
      <h1 class="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-brand-600 dark:text-ink-invert">
        ${book.title}
      </h1>
      <p class="mt-2 text-xs sm:text-sm text-muted dark:text-muted-invert">
        Tác giả: <strong class="font-semibold text-ink dark:text-ink-invert">${book.author}</strong>
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 border-b border-line dark:border-line-invert-light pb-4 text-xs">
        <span class="text-amber-500 text-sm">★★★★★</span>
        <span class="font-bold text-ink dark:text-ink-invert">${book.rating ? book.rating.toFixed(1) : "5.0"}</span>
        <span class="text-muted dark:text-muted-invert">(${book.reviewsCount || 100} đánh giá)</span>
        <span class="h-3 w-px bg-line dark:bg-line-invert-light"></span>
        <span class="text-muted dark:text-muted-invert">Đã bán ${book.sold || "1k"}</span>
      </div>

      <!-- Cụm Giá tiền (dùng whitespace-nowrap để không bị rớt chữ đ) -->
      <div class="mt-5 flex items-baseline gap-3 sm:gap-4">
        <span class="text-2xl sm:text-3xl font-bold text-accent-600 dark:text-accent-400 whitespace-nowrap">
          ${book.price.toLocaleString("vi-VN")} đ
        </span>
        <del class="text-xs sm:text-sm text-muted dark:text-muted-invert whitespace-nowrap">
          ${book.originalPrice.toLocaleString("vi-VN")} đ
        </del>
        <span class="rounded bg-accent-500 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-white whitespace-nowrap">
          -${Math.round((1 - book.price / book.originalPrice) * 100)}%
        </span>
      </div>

      <p class="mt-4 leading-relaxed text-xs sm:text-sm text-muted dark:text-muted-invert">
        ${book.description}
      </p>

      <!-- Nút Tăng giảm số lượng & Mua hàng -->
      <div class="mt-6 flex flex-col sm:flex-row gap-3">
        <div class="flex h-11 items-center justify-between rounded-lg border border-line dark:border-line-invert-light bg-surface dark:bg-line-invert sm:w-28 px-3 text-xs font-bold">
          <button type="button" id="qty-minus" class="w-6 h-full text-muted hover:text-ink text-base">-</button>
          <span id="qty-val">1</span>
          <button type="button" id="qty-plus" class="w-6 h-full text-muted hover:text-ink text-base">+</button>
        </div>
        <button type="button" id="btn-add-cart" class="h-11 flex-1 rounded-lg border-2 border-accent-500 px-5 font-bold text-accent-600 dark:text-accent-400 hover:bg-accent-500 hover:text-white transition text-xs whitespace-nowrap">
          Thêm vào giỏ
        </button>
        <button type="button" id="btn-buy-now" class="h-11 flex-1 flex items-center justify-center rounded-lg bg-accent-500 px-5 font-bold text-white hover:bg-accent-600 transition text-xs shadow-sm whitespace-nowrap">
          Mua ngay
        </button>
      </div>
    </div>
  `;
  // Đưa wrapper vào Fragment
  fragment.appendChild(wrapper);

  // 4. Chèn toàn bộ Fragment vào DOM thật CHỈ 1 LẦN DUY NHẤT để tránh reflow/repaint gây giật màn hình
  container.innerHTML = "";
  container.appendChild(fragment);

  // 5. Gắn sự kiện tương tác cho các nút vừa tạo
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
}