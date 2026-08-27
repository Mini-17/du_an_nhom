import { BookService } from "../services/bookServices.js";
import { CartService } from "../services/cartService.js";

export async function initShowroomPage() {
  const booksGrid = document.getElementById("books-grid");
  if (!booksGrid) return;

  const countDisplay = document.getElementById("books-count");
  const sortSelect = document.getElementById("sort-select");

  // Biến lưu trạng thái lọc hiện tại
  let selectedCategory = null;
  let selectedAuthor = null;

  // 1. Tải toàn bộ sách
  let allBooks = await BookService.getAllBooks();

  // 2. Render ban đầu
  renderBooks(allBooks);
  renderFilters(allBooks);
  initMobileFilterToggle();

  // 3. Xử lý sắp xếp giá
  sortSelect?.addEventListener("change", () => {
    applyFiltersAndSort();
  });

  // 4. Bắt sự kiện Thêm vào giỏ
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

  // Hàm Lọc kết hợp Sắp xếp
  function applyFiltersAndSort() {
    let result = [...allBooks];

    if (selectedCategory) {
      result = result.filter((b) => b.category === selectedCategory);
    }
    if (selectedAuthor) {
      result = result.filter((b) => b.author === selectedAuthor);
    }

    const sortValue = sortSelect?.value;
    if (sortValue === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    }

    renderBooks(result);
  }

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
        <article class="bg-surface dark:bg-line-invert border border-line dark:border-line-invert-light rounded-card overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition flex flex-col justify-between group">
          <a href="book-detail.html?id=${book.id}" class="aspect-3/4 bg-line/20 dark:bg-surface-invert overflow-hidden flex items-center justify-center relative p-3">
            <img 
              src="${book.cover}" 
              alt="${book.title}" 
              class="w-full h-full object-cover rounded shadow-sm group-hover:scale-105 transition-transform duration-300"
              onerror="this.parentElement.innerHTML='<div class=\\'w-full h-full flex items-center justify-center font-bold text-xs text-muted dark:text-muted-invert text-center p-2\\'>${book.title}</div>'"
            />
          </a>

         <!-- Thông tin Sách -->
          <div class="p-4 flex flex-col gap-1.5 flex-1 justify-between">
            <div>
              <p class="text-[11px] text-muted dark:text-muted-invert">${book.author}</p>
              <h3 class="font-display text-sm font-bold text-ink dark:text-ink-invert leading-snug mt-0.5">
                <a href="book-detail.html?id=${book.id}" class="hover:text-accent-600 dark:hover:text-accent-400 transition line-clamp-1">${book.title}</a>
              </h3>
            </div>

            <div class="mt-2">
              <div class="flex items-baseline gap-2">
                <span class="font-bold text-sm text-accent-600 dark:text-accent-400 whitespace-nowrap">${book.price.toLocaleString("vi-VN")} đ</span> 
                <del class="text-[11px] text-muted dark:text-muted-invert whitespace-nowrap">${book.originalPrice.toLocaleString("vi-VN")} đ</del>
              </div>
              <button 
                type="button" 
                data-add-book-id="${book.id}" 
                class="mt-3 w-full py-2 bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white rounded-lg text-xs font-bold transition shadow-sm">
                Thêm Vào Giỏ
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  // Hàm Render Bộ Lọc với cơ chế Click để chọn / Click lần nữa để Bỏ Chọn
  function renderFilters(books) {
    const categoryList = document.getElementById("category-filter-list");
    const authorList = document.getElementById("author-filter-list");

    // 1. Danh sách 6 thể loại chuẩn theo Danh mục nổi bật ở trang chủ
    const predefinedCategories = [
      "Văn Học",
      "Kinh Tế",
      "Tâm Lý Học",
      "Khoa Học",
      "Thiếu Nhi",
      "Lịch Sử"
    ];

    // Render Thể Loại
    if (categoryList) {
      categoryList.innerHTML = predefinedCategories
        .map(
          (cat) => `
          <li class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer w-full select-none text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition">
              <input type="checkbox" name="filter-cat" value="${cat}" class="cat-checkbox h-3.5 w-3.5 rounded accent-accent-500 cursor-pointer" />
              <span>${cat}</span>
            </label>
          </li>
        `
        )
        .join("");

      // Xử lý cơ chế Single Checkbox (chọn 1 mục, bấm lại chính nó thì bỏ chọn)
      const catInputs = categoryList.querySelectorAll(".cat-checkbox");
      catInputs.forEach((input) => {
        input.addEventListener("click", (e) => {
          if (selectedCategory === e.target.value) {
            e.target.checked = false;
            selectedCategory = null;
          } else {
            catInputs.forEach((i) => (i.checked = false));
            e.target.checked = true;
            selectedCategory = e.target.value;
          }
          applyFiltersAndSort();
        });
      });
    }

    // Render Tác Giả
    if (authorList) {
      const authors = [...new Set(books.map((b) => b.author))];
      authorList.innerHTML = authors
        .map(
          (author) => `
          <li>
            <label class="flex items-center gap-2 cursor-pointer w-full select-none text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition">
              <input type="checkbox" name="filter-author" value="${author}" class="author-checkbox h-3.5 w-3.5 rounded accent-accent-500 cursor-pointer" />
              <span class="truncate">${author}</span>
            </label>
          </li>
        `
        )
        .join("");

      const authorInputs = authorList.querySelectorAll(".author-checkbox");
      authorInputs.forEach((input) => {
        input.addEventListener("click", (e) => {
          if (selectedAuthor === e.target.value) {
            e.target.checked = false;
            selectedAuthor = null;
          } else {
            authorInputs.forEach((i) => (i.checked = false));
            e.target.checked = true;
            selectedAuthor = e.target.value;
          }
          applyFiltersAndSort();
        });
      });
    }
  }

  // Khởi tạo tính năng Đóng/Mở bộ lọc trên Mobile
  function initMobileFilterToggle() {
    const toggleBtn = document.getElementById("toggle-filter-mobile");
    const filterContent = document.getElementById("filter-content");
    const chevron = document.getElementById("filter-chevron");

    if (toggleBtn && filterContent) {
      toggleBtn.addEventListener("click", () => {
        const isHidden = filterContent.classList.toggle("hidden");
        if (chevron) {
          chevron.style.transform = isHidden ? "rotate(0deg)" : "rotate(180deg)";
        }
      });
    }
  }
}