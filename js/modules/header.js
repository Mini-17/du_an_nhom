export function initHeader() {
  highlightActiveNav();
}

function highlightActiveNav() {
  // Lấy tên tệp HTML hiện tại (ví dụ: showroom.html, book-detail.html...)
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  // 1. Cập nhật Menu Desktop
  const desktopLinks = document.querySelectorAll("header nav a");
  desktopLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    // Kiểm tra trùng khớp đường dẫn hoặc trang chi tiết thuộc về Cửa Hàng
    const isShowroomDetail = (currentPath === "book-detail.html" || currentPath === "showroom.html") && href === "showroom.html";
    const isMatch = href === currentPath || (currentPath === "" && href === "index.html") || isShowroomDetail;

    if (isMatch) {
      link.className = "text-brand-600 dark:text-accent-400 font-bold border-b-2 border-accent-500 pb-1";
    } else {
      link.className = "text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition";
    }
  });

  // 2. Cập nhật Bottom Bar Mobile
  const mobileLinks = document.querySelectorAll("nav.md\\:hidden a");
  mobileLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isShowroomDetail = (currentPath === "book-detail.html" || currentPath === "showroom.html") && href === "showroom.html";
    const isMatch = href === currentPath || (currentPath === "" && href === "index.html") || isShowroomDetail;

    if (isMatch) {
      link.classList.remove("text-muted", "dark:text-muted-invert");
      link.classList.add("text-accent-600", "dark:text-accent-400", "font-bold");
    } else {
      link.classList.remove("text-accent-600", "dark:text-accent-400", "font-bold");
      link.classList.add("text-muted", "dark:text-muted-invert");
    }
  });
}