import { BookService } from "../services/bookServices.js";
import { CartService } from "../services/cartService.js";

export async function initHomePage() {
  const suggestedContainer = document.getElementById("suggested-books");
  const bestsellerContainer = document.getElementById("bestseller-list");
  const newBooksContainer = document.getElementById("new-list");

  if (!suggestedContainer && !bestsellerContainer && !newBooksContainer) return;

  // 1. Tải danh sách sách từ Service
  const books = await BookService.getAllBooks();
  if (books.length === 0) return;

  // 2. Render từng khu vực
  renderSuggestedBooks(books.slice(0, 5));
  renderBestsellerBooks(books.slice(0, 3));
  renderNewBooks(books.slice(3, 6));

  // 3. Xử lý click danh mục để chuyển sang showroom
  initCategoryNavigation();

  // 4. Bắt sự kiện Thêm vào giỏ toàn cục cho Trang Chủ
  document.querySelector("main")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-book-id]");
    if (btn) {
      const bookId = btn.dataset.addBookId;
      const targetBook = books.find((b) => b.id === bookId);
      if (targetBook) {
        CartService.addItem(targetBook, 1);
      }
    }
  });

  // A. Render Mục "Đề Xuất Cho Bạn"
  function renderSuggestedBooks(suggestedList) {
    if (!suggestedContainer) return;
    suggestedContainer.innerHTML = suggestedList
      .map(
        (book) => `
        <article class="bg-surface dark:bg-line-invert border border-line dark:border-line-invert-light rounded-card overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-md transition flex flex-col justify-between group">
          <a href="book-detail.html?id=${book.id}" class="aspect-3/4 bg-line/20 dark:bg-surface-invert overflow-hidden flex items-center justify-center p-3">
            <img 
              src="${book.cover}" 
              alt="${book.title}" 
              class="w-full h-full object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-300"
              onerror="this.parentElement.innerHTML='<span class=\\'font-bold text-xs text-muted text-center p-2\\'>${book.title}</span>'"
            />
          </a>
          <div class="p-3 flex flex-col justify-between flex-1">
            <div>
              <p class="text-[10px] text-muted dark:text-muted-invert truncate">${book.author}</p>
              <h4 class="font-display font-bold text-xs sm:text-sm text-ink dark:text-ink-invert leading-snug mt-0.5">
                <a href="book-detail.html?id=${book.id}" class="hover:text-accent-600 transition line-clamp-1">${book.title}</a>
              </h4>
            </div>
            <div class="mt-2 flex items-center justify-between">
              <span class="font-bold text-xs sm:text-sm text-accent-600 dark:text-accent-400">
                ${book.price.toLocaleString("vi-VN")} đ
              </span>
              <button 
                type="button" 
                data-add-book-id="${book.id}" 
                class="p-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white text-xs transition"
                title="Thêm vào giỏ"
              >
                🛒
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  // B. Render Mục "Bán Chạy Nhất" (Danh sách ngang)
  function renderBestsellerBooks(bestsellerList) {
    if (!bestsellerContainer) return;
    bestsellerContainer.innerHTML = bestsellerList
      .map(
        (book, idx) => `
        <div class="flex items-center gap-4 py-3 border-b border-line dark:border-line-invert-light last:border-b-0">
          <span class="font-display font-bold text-xl sm:text-2xl text-accent-600 dark:text-accent-400 w-6 text-center shrink-0">
            0${idx + 1}
          </span>
          <a href="book-detail.html?id=${book.id}" class="w-12 h-16 rounded bg-line/40 dark:bg-surface-invert shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="${book.cover}" 
              alt="${book.title}" 
              class="w-full h-full object-cover" 
              onerror="this.parentElement.innerHTML='<span class=\\'font-bold text-[8px] text-muted text-center p-1\\'>${book.title}</span>'"
            />
          </a>
          <div class="flex-1 min-w-0">
            <h4 class="font-display font-bold text-xs sm:text-sm text-ink dark:text-ink-invert truncate">
              <a href="book-detail.html?id=${book.id}" class="hover:text-accent-600 transition">${book.title}</a>
            </h4>
            <p class="text-[11px] text-muted dark:text-muted-invert mt-0.5">${book.author}</p>
            <span class="font-bold text-xs text-accent-600 dark:text-accent-400 mt-1 inline-block">
              ${book.price.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <button 
            type="button" 
            data-add-book-id="${book.id}" 
            class="px-3 py-1.5 rounded-lg border border-accent-500 text-accent-600 dark:text-accent-400 hover:bg-accent-500 hover:text-white transition text-xs font-semibold whitespace-nowrap shrink-0"
          >
            + Mua
          </button>
        </div>
      `
      )
      .join("");
  }

  // C. Render Mục "Sách Mới Về" (Danh sách ngang)
  function renderNewBooks(newList) {
    if (!newBooksContainer) return;
    newBooksContainer.innerHTML = newList
      .map(
        (book) => `
        <div class="flex items-center gap-4 py-3 border-b border-line dark:border-line-invert-light last:border-b-0">
          <a href="book-detail.html?id=${book.id}" class="w-12 h-16 rounded bg-line/40 dark:bg-surface-invert shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
            <img 
              src="${book.cover}" 
              alt="${book.title}" 
              class="w-full h-full object-cover" 
              onerror="this.parentElement.innerHTML='<span class=\\'font-bold text-[8px] text-muted text-center p-1\\'>${book.title}</span>'"
            />
          </a>
          <div class="flex-1 min-w-0">
            <span class="inline-block px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[9px] font-bold">Mới</span>
            <h4 class="font-display font-bold text-xs sm:text-sm text-ink dark:text-ink-invert truncate mt-0.5">
              <a href="book-detail.html?id=${book.id}" class="hover:text-accent-600 transition">${book.title}</a>
            </h4>
            <p class="text-[11px] text-muted dark:text-muted-invert">${book.author}</p>
            <span class="font-bold text-xs text-accent-600 dark:text-accent-400 mt-0.5 inline-block">
              ${book.price.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <button 
            type="button" 
            data-add-book-id="${book.id}" 
            class="px-3 py-1.5 rounded-lg border border-accent-500 text-accent-600 dark:text-accent-400 hover:bg-accent-500 hover:text-white transition text-xs font-semibold whitespace-nowrap shrink-0"
          >
            + Mua
          </button>
        </div>
      `
      )
      .join("");
  }

  // D. Chuyển hướng khi bấm vào các mục "Danh Mục Nổi Bật"
  function initCategoryNavigation() {
    const categoryCards = document.querySelectorAll(".grid-cols-3.md\\:grid-cols-6 > div");
    categoryCards.forEach((card) => {
      card.addEventListener("click", () => {
        const catName = card.textContent.replace(/[\u{1F300}-\u{1F9FF}]/gu, "").trim();
        window.location.href = `showroom.html?category=${encodeURIComponent(catName)}`;
      });
    });
  }
}