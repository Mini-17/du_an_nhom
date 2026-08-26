import { initTheme } from "./theme.js";
import { initBackToTop } from "./backToTop.js";
import { initHeader } from "./header.js";


document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initBackToTop();
  initHeader();
});