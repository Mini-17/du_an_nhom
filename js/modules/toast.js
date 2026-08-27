export function showToast(message, duration = 3000) {
  // 1. Tìm hoặc tạo khung chứa Toast (Đặt cố định ở góc dưới)
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    // Đặt ở góc dưới bên phải, cách đáy hợp lý để không che Bottom Bar trên Mobile
    container.className = "fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 flex flex-col gap-2 pointer-events-none";
    document.body.appendChild(container);
  }

  // 2. Tạo phần tử thông báo
  const toast = document.createElement("div");
  toast.className = `
    pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-xl 
    bg-ink/90 dark:bg-surface/95 text-surface dark:text-ink 
    text-xs font-semibold shadow-xl border border-line/20 dark:border-line-invert-light 
    backdrop-blur-md transform transition-all duration-300 ease-out 
    translate-y-4 opacity-0
  `;
  
  toast.innerHTML = `
    <span class="text-sm">✨</span>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  // 3. Hiệu ứng trượt lên và mờ dần xuất hiện
  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-4", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  // 4. Tự động biến mất sau khoảng thời gian cài đặt
  setTimeout(() => {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(() => {
      toast.remove();
      if (container.children.length === 0) {
        container.remove();
      }
    }, 300);
  }, duration);
}