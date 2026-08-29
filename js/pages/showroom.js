import { BookService } from "../services/bookServices.js";
import { CartService } from "../services/cartService.js";

export async function initShowroomPage() {
  const booksGrid = document.getElementById("books-grid");
  if (!booksGrid) return;

  const countDisplay = document.getElementById("books-count");
  const totalDisplay = document.getElementById("books-total");
  const sortSelect = document.getElementById("sort-select");
  const paginationContainer = document.getElementById("pagination-container");
  const priceRange = document.getElementById("price-range");
  const priceRangeVal = document.getElementById("price-range-val");

  const ITEMS_PER_PAGE = 6;
  let currentPage = 1;

  // Trạng thái bộ lọc
  let selectedCategory = null;
  let selectedAuthor = null;
  let selectedRating = null;
  let maxPrice = 500000;

  // Đọc URL query nếu có
  const urlParams = new URLSearchParams(window.location.search);
  const catUrl = urlParams.get("category");
  const searchUrl = urlParams.get("search");

  if (catUrl) selectedCategory = decodeURIComponent(catUrl);
  let searchKeyword = searchUrl ? decodeURIComponent(searchUrl).toLowerCase() : null;

  // 1. Tải toàn bộ dữ liệu sách
  let allBooks = await BookService.getAllBooks();
  if (totalDisplay) totalDisplay.textContent = allBooks.length;

  // 2. Render ban đầu
  applyFiltersAndSort();
  renderFilters(allBooks);
  initMobileFilterToggle();

  // 3. Sự kiện thay đổi khoảng giá
  priceRange?.addEventListener("input", (e) => {
    maxPrice = Number(e.target.value);
    if (priceRangeVal) priceRangeVal.textContent = `${maxPrice.toLocaleString("vi-VN")} đ`;
    currentPage = 1;
    applyFiltersAndSort();
  });

  // 4. Sự kiện sắp xếp
  sortSelect?.addEventListener("change", () => {
    currentPage = 1;
    applyFiltersAndSort();
  });

  // 5. Sự kiện Thêm vào giỏ hàng từ Card
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

  // ================= LOGIC LỌC & PHÂN TRANG =================
  function applyFiltersAndSort() {
    let result = [...allBooks];

    // Lọc từ khóa tìm kiếm
    if (searchKeyword) {
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(searchKeyword) ||
          b.author.toLowerCase().includes(searchKeyword)
      );
    }

    // Lọc thể loại
    if (selectedCategory) {
      result = result.filter((b) =>
        b.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Lọc tác giả
    if (selectedAuthor) {
      result = result.filter((b) => b.author === selectedAuthor);
    }

    // Lọc theo khoảng giá
    result = result.filter((b) => b.price <= maxPrice);

    // Lọc theo đánh giá sao
    if (selectedRating) {
      result = result.filter((b) => (b.rating || 5) >= selectedRating);
    }

    // Sắp xếp
    const sortValue = sortSelect?.value;
    if (sortValue === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortValue === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortValue === "popular") {
      result.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    }

    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;

    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedBooks = result.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    renderBooks(paginatedBooks, totalItems);
    renderPagination(totalPages);
  }

  // ================= RENDER CARD SÁCH CHUẨN FIGMA =================
  function renderBooks(books, totalItems) {
    if (countDisplay) countDisplay.textContent = books.length;

    if (books.length === 0) {
      booksGrid.innerHTML = `
        <div class="col-span-full py-16 text-center text-muted dark:text-muted-invert text-sm">
          <p class="font-bold text-base">Không tìm thấy cuốn sách nào phù hợp.</p>
          <p class="text-xs mt-1">Hãy thử điều chỉnh lại bộ lọc hoặc khoảng giá của bạn.</p>
        </div>
      `;
      return;
    }

    booksGrid.innerHTML = books
      .map(
        (book) => `
        <article class="bg-surface dark:bg-line-invert rounded-3xl border border-line dark:border-line-invert-light p-4 shadow-sm hover:-translate-y-1.5 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <!-- Bìa Sách trong khung nền chuẩn Figma -->
          <a href="book-detail.html?id=${book.id}" class="w-full aspect-4/5 bg-line/20 dark:bg-surface-invert rounded-2xl flex items-center justify-center p-4 overflow-hidden relative">
            <img 
              src="${book.cover}" 
              alt="${book.title}" 
              class="h-full w-auto max-h-56 aspect-2/3 object-cover rounded-lg shadow-md group-hover:scale-105 transition-transform duration-300"
              onerror="this.parentElement.innerHTML='<div class=\\'h-full w-full flex items-center justify-center font-bold text-xs text-muted dark:text-muted-invert text-center p-2\\'>${book.title}</div>'"
            />
          </a>

          <!-- Thông tin Sách -->
          <div class="pt-4 flex flex-col justify-between flex-1">
            <div>
              <p class="text-[11px] text-muted dark:text-muted-invert">${book.author}</p>
              <h3 class="font-display text-sm font-bold text-ink dark:text-ink-invert leading-snug mt-1 line-clamp-1">
                <a href="book-detail.html?id=${book.id}" class="hover:text-accent-600 dark:hover:text-accent-400 transition">${book.title}</a>
              </h3>
              <!-- Sao vàng -->
              <div class="text-amber-500 text-xs mt-1.5">★★★★★</div>
            </div>

            <div class="mt-3">
              <!-- Giá tiền -->
              <div class="flex items-baseline gap-2">
                <span class="font-display font-bold text-sm text-accent-600 dark:text-accent-400 whitespace-nowrap">
                  ${book.price.toLocaleString("vi-VN")} đ
                </span>
                <del class="text-[11px] text-muted dark:text-muted-invert whitespace-nowrap">
                  ${book.originalPrice.toLocaleString("vi-VN")} đ
                </del>
              </div>

              <!-- Nút Thêm Vào Giỏ Chuẩn Figma Outline -->
              <button 
                type="button" 
                data-add-book-id="${book.id}" 
                class="mt-3 w-full py-2.5 rounded-xl border border-line dark:border-line-invert-light hover:border-accent-500 dark:hover:border-accent-400 hover:bg-accent-500 hover:text-white dark:hover:text-white text-ink dark:text-ink-invert font-bold text-xs transition flex items-center justify-center gap-2 shadow-sm">
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                Thêm Vào Giỏ
              </button>
            </div>
          </div>
        </article>
      `
      )
      .join("");
  }

  // ================= RENDER CÁC BỘ LỌC TƯƠNG TÁC =================
  function renderFilters(books) {
    const categoryList = document.getElementById("category-filter-list");
    const authorList = document.getElementById("author-filter-list");
    const ratingGroup = document.getElementById("rating-filter-group");

    // 1. Thể Loại Sách kèm số lượng đếm chuẩn Figma
    const categoriesData = [
      { name: "Văn Học", count: 124 },
      { name: "Kinh Tế", count: 85 },
      { name: "Tâm Lý Học", count: 62 },
      { name: "Khoa Học", count: 47 },
      { name: "Thiếu Nhi", count: 91 },
      { name: "Lịch Sử", count: 33 },
      { name: "Ngoại Ngữ", count: 58 }
    ];

    if (categoryList) {
      categoryList.innerHTML = categoriesData
        .map((cat) => {
          const isActive = selectedCategory && selectedCategory.toLowerCase().includes(cat.name.toLowerCase());
          return `
            <li class="flex items-center justify-between cursor-pointer py-1 text-xs select-none transition ${
              isActive ? "font-bold text-accent-600 dark:text-accent-400" : "text-ink dark:text-ink-invert hover:text-accent-600"
            }" data-cat-name="${cat.name}">
              <span>${cat.name}</span>
              <span class="text-muted dark:text-muted-invert text-[11px]">(${cat.count})</span>
            </li>
          `;
        })
        .join("");

      categoryList.querySelectorAll("[data-cat-name]").forEach((el) => {
        el.addEventListener("click", () => {
          const clickedCat = el.dataset.catName;
          selectedCategory = selectedCategory === clickedCat ? null : clickedCat;
          currentPage = 1;
          renderFilters(books);
          applyFiltersAndSort();
        });
      });
    }

    // 2. Đánh giá sao
    const ratingRadios = ratingGroup?.querySelectorAll(".rating-radio");
    ratingRadios?.forEach((radio) => {
      radio.addEventListener("click", (e) => {
        const val = Number(e.target.value);
        if (selectedRating === val) {
          e.target.checked = false;
          selectedRating = null;
        } else {
          selectedRating = val;
        }
        currentPage = 1;
        applyFiltersAndSort();
      });
    });

    // 3. Tác Giả Checkbox chuẩn Figma
    if (authorList) {
      const authors = [...new Set(books.map((b) => b.author))];
      authorList.innerHTML = authors
        .map(
          (author) => `
          <li>
            <label class="flex items-center gap-2.5 cursor-pointer w-full select-none text-ink dark:text-ink-invert hover:text-accent-600 transition">
              <input type="checkbox" name="filter-author" value="${author}" class="author-checkbox h-3.5 w-3.5 rounded accent-accent-500 cursor-pointer" ${selectedAuthor === author ? "checked" : ""} />
              <span class="truncate">${author}</span>
            </label>
          </li>
        `
        )
        .join("");

      const authorInputs = authorList.querySelectorAll(".author-checkbox");
      authorInputs.forEach((input) => {
        input.addEventListener("click", (e) => {
          currentPage = 1;
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

  // ================= PHÂN TRANG =================
  function renderPagination(totalPages) {
    if (!paginationContainer) return;

    if (totalPages <= 1) {
      paginationContainer.innerHTML = "";
      return;
    }

    let buttonsHtml = "";
    for (let i = 1; i <= totalPages; i++) {
      const isActive = i === currentPage;
      buttonsHtml += `
        <button 
          type="button" 
          data-page="${i}" 
          class="flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold transition ${
            isActive
              ? "bg-accent-500 text-white shadow-sm cursor-default"
              : "border border-line dark:border-line-invert-light text-ink dark:text-ink-invert hover:border-accent-500 hover:text-accent-600"
          }">
          ${i}
        </button>
      `;
    }

    paginationContainer.innerHTML = buttonsHtml;

    paginationContainer.querySelectorAll("[data-page]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const targetPage = Number(e.target.dataset.page);
        if (targetPage !== currentPage) {
          currentPage = targetPage;
          applyFiltersAndSort();
          booksGrid.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      });
    });
  }

  // Toggle trên Mobile
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