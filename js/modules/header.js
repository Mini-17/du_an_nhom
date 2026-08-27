export function initHeader() {
  // Sticky Blur Header
  const header = document.querySelector("header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("shadow-sm", "backdrop-blur-md");
      } else {
        header.classList.remove("shadow-sm", "backdrop-blur-md");
      }
    });
  }

  // Mobile Menu Drawer
  const menuBtn = document.querySelector("[data-mobile-menu-btn]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}