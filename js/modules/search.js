import { BookService } from "../services/bookServices.js";

export async function initLiveSearch() {
  const searchInputs = document.querySelectorAll('input[type="search"]');
  if (!searchInputs.length) return;

  const books = await BookService.getAllBooks();

  searchInputs.forEach((input) => {
    const parentContainer = input.parentElement;
    if (!parentContainer) return;

    // Đảm bảo container có relative để định vị dropdown
    if (!parentContainer.classList.contains("relative")) {
      parentContainer.classList.add("relative");
    }

    // Tạo hộp dropdown hiển thị kết quả gợi ý
    let dropdown = parentContainer.querySelector(".search-results-dropdown");
    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.className =
        "search-results-dropdown hidden absolute left-0 right-0 top-full mt-2 bg-surface dark:bg-line-invert rounded-2xl border border-line dark:border-line-invert-light shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto";
      parentContainer.appendChild(dropdown);
    }

    // Bắt sự kiện khi gõ phím
    input.addEventListener("input", (e) => {
      const keyword = e.target.value.trim().toLowerCase();

      if (!keyword) {
        dropdown.innerHTML = "";
        dropdown.classList.add("hidden");
        return;
      }

      const results = books.filter(
        (b) =>
          b.title.toLowerCase().includes(keyword) ||
          b.author.toLowerCase().includes(keyword)
      );

      if (results.length === 0) {
        dropdown.innerHTML = `
          <div class="p-4 text-center text-xs text-muted dark:text-muted-invert">
            Không tìm thấy sách nào cho "<strong>${e.target.value}</strong>"
          </div>
        `;
      } else {
        dropdown.innerHTML = results
          .slice(0, 5)
          .map(
            (book) => `
            <a href="book-detail.html?id=${book.id}" class="flex items-center gap-3 p-3 hover:bg-line/20 dark:hover:bg-surface-invert/40 transition border-b border-line/60 dark:border-line-invert-light/40 last:border-b-0">
              <div class="w-10 h-14 rounded bg-line/40 dark:bg-surface-invert overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                <img 
                  src="${book.cover}" 
                  alt="${book.title}" 
                  class="w-full h-full object-cover" 
                  onerror="this.parentElement.innerHTML='<span class=\\'text-[8px] font-bold text-muted\\'>Bìa</span>'" 
                />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-xs font-bold text-ink dark:text-ink-invert truncate">${book.title}</h4>
                <p class="text-[11px] text-muted dark:text-muted-invert truncate">${book.author}</p>
                <span class="text-xs font-bold text-accent-600 dark:text-accent-400 mt-0.5 inline-block">${book.price.toLocaleString("vi-VN")} đ</span>
              </div>
            </a>
          `
          )
          .join("");
      }

      dropdown.classList.remove("hidden");
    });

    // Nhấn Enter chuyển sang showroom lọc theo từ khóa, nhấn Escape đóng dropdown
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const keyword = input.value.trim();
        if (keyword) {
          dropdown.classList.add("hidden");
          window.location.href = `showroom.html?search=${encodeURIComponent(keyword)}`;
        }
      } else if (e.key === "Escape") {
        dropdown.classList.add("hidden");
      }
    });

    // Đóng dropdown khi click bên ngoài
    document.addEventListener("click", (e) => {
      if (!parentContainer.contains(e.target)) {
        dropdown.classList.add("hidden");
      }
    });
  });
}