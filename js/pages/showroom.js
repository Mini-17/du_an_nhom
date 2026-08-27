import { BookService } from "../services/bookServices.js";
import { CartService } from "../services/cartService.js";

export async function initShowroomPage() {
  const booksGrid = document.getElementById("books-grid");
  if (!booksGrid) return;

  const countDisplay = document.getElementById("books-count");
  const sortSelect = document.getElementById("sort-select");

  // 1. Tải toàn bộ sách từ Service
  let allBooks = await BookService.getAllBooks();

  // 2. Render danh sách ban đầu
  renderBooks(allBooks);
  renderFilters(allBooks);

  // 3. Xử lý sắp xếp giá
  sortSelect?.addEventListener("change", (e) => {
    let sortedBooks = [...allBooks];
    if (e.target.value === "price-asc") {
      sortedBooks.sort((a, b) => a.price - b.price);
    } else if (e.target.value === "price-desc") {
      sortedBooks.sort((a, b) => b.price - a.price);
    }
    renderBooks(sortedBooks);
  });

  // 4. Bắt sự kiện Thêm vào giỏ hàng trực tiếp từ Card
  booksGrid.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-book-id]");
    if (btn) {
      const bookId = btn.dataset.addBookId;
      const targetBook = allBooks.find((b) => b.id === bookId);
      if (targetBook) {
        CartService.addItem(targetBook, 1);
      }
    }
  });

  // Hàm Render thẻ Card Sách
  function renderBooks(books) {
    if (countDisplay) countDisplay.textContent = books.length;

    if (books.length === 0) {
      booksGrid.innerHTML = `
        <div class="col-span-full py-12 text-center text-muted dark:text-muted-invert text-sm">
          Không tìm thấy cuốn sách nào phù hợp.
        </div>
      `;
      return;
    }

    booksGrid.innerHTML = books
      .map(
        (book) => `
        <article class="bg-surface dark:bg-line-invert border border-line dark:border-line-invert-light rounded-card overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between">
          <a href="book-detail.html?id=${book.id}" class="aspect-3/4 bg-line/30 dark:bg-surface-invert flex items-center justify-center font-bold text-muted dark:text-muted-invert text-center p-4">
            ${book.title}
          </a>
          <div class="p-4 flex flex-col gap-1.5">
            <p class="text-xs text-muted dark:text-muted-invert">${book.author}</p>
            <h3 class="font-display text-sm font-bold text-ink dark:text-ink-invert leading-snug">
              <a href="book-detail.html?id=${book.id}" class="hover:text-accent-500 transition line-clamp-1">${book.title}</a>
            </h3>
            <p class="text-sm">
              <span class="font-bold text-accent-600 dark:text-accent-400">${book.price.toLocaleString("vi-VN")} đ</span> 
              <span class="ml-1 text-xs text-muted line-through">${book.originalPrice.toLocaleString("vi-VN")} đ</span>
            </p>
            <button 
              type="button" 
              data-add-book-id="${book.id}" 
              class="mt-2 w-full py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-lg text-xs font-bold transition">
              Thêm Vào Giỏ
            </button>
          </div>
        </article>
      `
      )
      .join("");
  }

  // Hàm Render danh mục lọc tự động
  function renderFilters(books) {
    const categoryList = document.getElementById("category-filter-list");
    const authorList = document.getElementById("author-filter-list");

    if (categoryList) {
      const categories = [...new Set(books.map((b) => b.category))];
      categoryList.innerHTML = categories
        .map(
          (cat) => `
          <li class="flex items-center justify-between">
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="filter-cat" value="${cat}" class="h-4 w-4 rounded accent-accent-500" /> ${cat}
            </label>
          </li>
        `
        )
        .join("");

      categoryList.addEventListener("change", (e) => {
        const selectedCat = e.target.value;
        const filtered = books.filter((b) => b.category === selectedCat);
        renderBooks(filtered);
      });
    }

    if (authorList) {
      const authors = [...new Set(books.map((b) => b.author))];
      authorList.innerHTML = authors
        .map(
          (author) => `
          <li>
            <label class="flex items-center gap-2.5 cursor-pointer">
              <input type="radio" name="filter-author" value="${author}" class="h-4 w-4 rounded accent-accent-500" /> ${author}
            </label>
          </li>
        `
        )
        .join("");

      authorList.addEventListener("change", (e) => {
        const selectedAuthor = e.target.value;
        const filtered = books.filter((b) => b.author === selectedAuthor);
        renderBooks(filtered);
      });
    }
  }
}