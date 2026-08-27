import { initTheme } from "./modules/theme.js";
import { initBackToTop } from "./modules/backToTop.js";
import { initHeader } from "./modules/header.js";
import { initScrollReveal } from "./modules/scrollReveal.js";
import { CartService } from "./services/cartService.js";
import { initShowroomPage } from "./pages/showroom.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHeader();
  initScrollReveal();
  CartService.updateBadge();

  if (document.getElementById("books-grid")) {
    initShowroomPage();
  }
});