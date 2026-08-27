import { showToast } from "./toast.js";

export function initTheme() {
  const themeToggleBtns = document.querySelectorAll("[data-theme-toggle]");
  
  const isDarkMode =
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  if (isDarkMode) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  themeToggleBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isDark = document.documentElement.classList.toggle("dark");
      localStorage.setItem("theme", isDark ? "dark" : "light");
      showToast(isDark ? "🌙 Đã đổi sang chế độ Tối" : "☀️ Đã đổi sang chế độ Sáng");
    });
  });
}