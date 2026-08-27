export function initBackToTop() {
  let backBtn = document.getElementById("back-to-top");
  if (!backBtn) {
    backBtn = document.createElement("button");
    backBtn.id = "back-to-top";
    backBtn.setAttribute("aria-label", "Cuộn lên đầu trang");
    
    backBtn.className =
      "fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 p-3 rounded-full bg-accent-500 hover:bg-accent-600 active:bg-accent-700 text-white shadow-lg transition-all duration-300 transform translate-y-12 opacity-0 pointer-events-none";
      
    backBtn.innerHTML = `
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
      </svg>
    `;
    document.body.appendChild(backBtn);
  }

  window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      backBtn.classList.remove("translate-y-12", "opacity-0", "pointer-events-none");
      backBtn.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");
    } else {
      backBtn.classList.add("translate-y-12", "opacity-0", "pointer-events-none");
      backBtn.classList.remove("translate-y-0", "opacity-100", "pointer-events-auto");
    }
  });

  backBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}