import { initTheme } from "./theme.js";
import { initBackToTop } from "./backToTop.js";
import { initHeader } from "./header.js";
import { initScrollReveal } from "./scrollReveal.js";

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHeader();
  initScrollReveal();
});