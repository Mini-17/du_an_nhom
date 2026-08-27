import { CartService } from "../services/cartService.js";
import { showToast } from "../modules/toast.js";

export function initCartPage() {
  const cartListContainer = document.getElementById("cart-items-list");
  if (!cartListContainer) return;

  let currentDiscount = 0;

  renderCart();

  // 1. Hàm render dữ liệu giỏ hàng
  function renderCart() {
    const items = CartService.getItems();
    const shippingFee = items.length > 0 ? 30000 : 0;
    const summary = CartService.getSummary(shippingFee, currentDiscount);

    // Cập nhật số lượng tiêu đề
    const countText = document.getElementById("cart-header-count");
    if (countText) {
      countText.textContent = items.length > 0
        ? `Bạn có ${items.length} đầu sách (${summary.totalItems} cuốn) trong giỏ hàng`
        : "Giỏ hàng của bạn đang trống";
    }

    // Render danh sách sản phẩm
    if (items.length === 0) {
      cartListContainer.innerHTML = `
        <div class="bg-surface dark:bg-line-invert rounded-card p-10 border border-line dark:border-line-invert-light text-center shadow-sm">
          <p class="text-sm text-muted dark:text-muted-invert mb-4">Chưa có sản phẩm nào trong giỏ hàng của bạn.</p>
          <a href="showroom.html" class="inline-block px-6 py-2.5 rounded-full bg-accent-500 hover:bg-accent-600 text-white font-bold text-xs transition shadow-sm">
            Khám phá sách ngay
          </a>
        </div>
      `;
    } else {
      cartListContainer.innerHTML = items
        .map(
          (item) => `
          <div class="bg-surface dark:bg-line-invert rounded-card p-5 border border-line dark:border-line-invert-light shadow-sm grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <!-- Cột thông tin sách -->
            <div class="sm:col-span-6 flex items-center gap-4">
              <a href="book-detail.html?id=${item.id}" class="w-14 h-20 rounded bg-line/40 dark:bg-surface-invert shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
                <img 
                  src="${item.cover}" 
                  alt="${item.title}" 
                  class="w-full h-full object-cover" 
                  onerror="this.parentElement.innerHTML='<span class=\\'font-bold text-[9px] text-muted text-center p-1\\'>${item.title}</span>'"
                />
              </a>
              <div>
                <h3 class="font-display font-bold text-sm sm:text-base text-ink dark:text-ink-invert leading-snug">
                  <a href="book-detail.html?id=${item.id}" class="hover:text-accent-600 transition">${item.title}</a>
                </h3>
                <p class="text-xs text-muted dark:text-muted-invert mt-0.5">${item.author || "Tác giả"}</p>
              </div>
            </div>

            <!-- Đơn giá -->
            <div class="sm:col-span-2 text-left sm:text-center text-sm font-semibold text-ink dark:text-ink-invert">
              ${item.price.toLocaleString("vi-VN")} đ
            </div>

            <!-- Điều chỉnh số lượng -->
            <div class="sm:col-span-2 flex items-center justify-start sm:justify-center">
              <div class="flex items-center border border-line dark:border-line-invert-light rounded-lg bg-surface dark:bg-surface-invert">
                <button type="button" data-action="decrease" data-id="${item.id}" class="w-7 h-7 flex items-center justify-center text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert font-bold text-sm">-</button>
                <input type="text" value="${item.quantity}" readonly class="w-8 text-center text-xs font-bold bg-transparent outline-none text-ink dark:text-ink-invert" />
                <button type="button" data-action="increase" data-id="${item.id}" class="w-7 h-7 flex items-center justify-center text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert font-bold text-sm">+</button>
              </div>
            </div>

            <!-- Thành tiền & Nút xóa -->
            <div class="sm:col-span-2 flex items-center justify-between sm:justify-end gap-3">
              <span class="font-bold text-sm text-accent-600 dark:text-accent-400 whitespace-nowrap">
                ${(item.price * item.quantity).toLocaleString("vi-VN")} đ
              </span>
              <button type="button" data-action="remove" data-id="${item.id}" class="text-muted dark:text-muted-invert hover:text-rose-500 transition p-1" title="Xóa">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        `
        )
        .join("");
    }

    // Cập nhật bảng tính tiền bên phải
    const subtotalEl = document.getElementById("cart-subtotal");
    const shippingEl = document.getElementById("cart-shipping");
    const discountEl = document.getElementById("cart-discount");
    const totalEl = document.getElementById("cart-total");
    const checkoutBtn = document.getElementById("btn-checkout");

    if (subtotalEl) subtotalEl.textContent = `${summary.subtotal.toLocaleString("vi-VN")} đ`;
    if (shippingEl) shippingEl.textContent = `${shippingFee.toLocaleString("vi-VN")} đ`;
    if (discountEl) discountEl.textContent = `- ${currentDiscount.toLocaleString("vi-VN")} đ`;
    if (totalEl) totalEl.textContent = `${summary.total.toLocaleString("vi-VN")} đ`;

    if (checkoutBtn) {
      checkoutBtn.classList.toggle("pointer-events-none", items.length === 0);
      checkoutBtn.classList.toggle("opacity-50", items.length === 0);
    }
  }

  // 2. Bắt sự kiện thao tác tăng / giảm / xóa
  cartListContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-action]");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = btn.dataset.id;
    const item = CartService.getItems().find((i) => i.id === id);

    if (action === "increase" && item) {
      CartService.updateQuantity(id, item.quantity + 1);
    } else if (action === "decrease" && item) {
      CartService.updateQuantity(id, item.quantity - 1);
    } else if (action === "remove") {
      CartService.removeItem(id);
    }
    renderCart();
  });

  // 3. Xử lý mã giảm giá
  document.getElementById("btn-apply-coupon")?.addEventListener("click", () => {
    const input = document.getElementById("discount-input");
    const code = input?.value.trim().toUpperCase();

    if (code === "BOOKNEST" || code === "GIAM30") {
      currentDiscount = 30000;
      showToast("Áp dụng mã giảm giá 30.000 đ thành công!");
      renderCart();
    } else if (code === "") {
      showToast("Vui lòng nhập mã giảm giá.");
    } else {
      showToast("Mã giảm giá không hợp lệ!");
    }
  });
}