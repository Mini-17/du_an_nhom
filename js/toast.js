let toastTimeout;

export function showToast(message) {
  let toast = document.getElementById("global-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "global-toast";
    toast.className =
      "fixed top-5 right-5 z-50 px-4 py-2.5 rounded-xl bg-brand-900 text-surface text-xs font-semibold shadow-xl transition-all duration-300 transform -translate-y-10 opacity-0 pointer-events-none";
    document.body.appendChild(toast);
  }

  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.remove("-translate-y-10", "opacity-0", "pointer-events-none");
  toast.classList.add("translate-y-0", "opacity-100", "pointer-events-auto");

  toastTimeout = setTimeout(() => {
    toast.classList.add("-translate-y-10", "opacity-0", "pointer-events-none");
    toast.classList.remove("translate-y-0", "opacity-100", "pointer-events-auto");
  }, 2500);
}