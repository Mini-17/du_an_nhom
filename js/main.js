import { initTheme } from "./modules/theme.js";
import { initBackToTop } from "./modules/backToTop.js";
import { initHeader } from "./modules/header.js";
import { initScrollReveal } from "./modules/scrollReveal.js";
import { CartService } from "./services/cartService.js";
import { initLiveSearch } from "./modules/search.js";
import { initShowroomPage } from "./pages/showroom.js";
import { initBookDetailPage } from "./pages/bookDetail.js";
import { initCartPage } from "./pages/cartPage.js";
import { initCheckoutPage } from "./pages/checkoutPage.js";
import { initProfilePage } from "./pages/profilePage.js";
import { initHomePage } from "./pages/homePage.js";
import { initAuthPage } from "./pages/authPage.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHeader();
  initScrollReveal();
  CartService.updateBadge();
  initLiveSearch();
  initAuthPage();  //Kích hoạt toàn cục

   // Khởi chạy Trang Chủ
  if (document.getElementById("suggested-books") || document.getElementById("bestseller-list")) {
    initHomePage();
  }

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

  // 5. Khởi chạy trang Profile[cite: 11, 16]
  if (document.getElementById("profile-form") || document.getElementById("orders-history-tbody")) {
    initProfilePage();
  }
});