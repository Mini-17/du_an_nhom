import { initTheme } from "./modules/theme.js";
import { initBackToTop } from "./modules/backToTop.js";
import { initHeader } from "./modules/header.js";
import { initScrollReveal } from "./modules/scrollReveal.js";
import { CartService } from "./services/cartService.js";
import { initShowroomPage } from "./pages/showroom.js";
import { initBookDetailPage } from "./pages/bookDetail.js";
import { initCartPage } from "./pages/cartPage.js";
import { initCheckoutPage } from "./pages/checkoutPage.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHeader();
  initScrollReveal();
  CartService.updateBadge();

  // Khởi chạy trang Showroom nếu có
  if (document.getElementById("books-grid")) {
    initShowroomPage();
  }

  // 2. Khởi chạy trang Chi tiết sách nếu có
  if (document.getElementById("book-detail-container")) {
    initBookDetailPage();
  }

  // 3. Khởi chạy trang Giỏ hàng
  if (document.getElementById("cart-items-list")) {
    initCartPage();
  }

  // 4. Khởi chạy trang Checkout
  if (document.getElementById("checkout-form")) {
    initCheckoutPage();
  }
});