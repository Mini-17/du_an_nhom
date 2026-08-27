import { initTheme } from "./modules/theme.js";
import { initBackToTop } from "./modules/backToTop.js";
import { initHeader } from "./modules/header.js";
import { initScrollReveal } from "./modules/scrollReveal.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHeader();
  initScrollReveal();
});