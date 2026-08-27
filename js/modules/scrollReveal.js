export function initScrollReveal() {
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px 0px -50px 0px",
    threshold: 0.10 // Kích hoạt khi phần tử hiện 15% trong khung nhìn
  };

  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Xóa trạng thái ẩn ban đầu
        entry.target.classList.remove("opacity-0", "translate-y-8");
        entry.target.classList.add("opacity-100", "translate-y-0");
        
        // Ngừng quan sát sau khi đã lộ dần xong
        observerInstance.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => {
    // Thiết lập class chuyển động mượt ban đầu
    el.classList.add(
      "opacity-0",
      "translate-y-8",
      "transition-all",
      "duration-700",
      "ease-out"
    );
    observer.observe(el);
  });
}