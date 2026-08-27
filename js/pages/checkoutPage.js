import { CartService } from "../services/cartService.js";
import { UserService } from "../services/userService.js";
import { OrderService } from "../services/orderService.js";
import { showToast } from "../modules/toast.js";

export function initCheckoutPage() {
  const checkoutForm = document.getElementById("checkout-form");
  const itemsContainer = document.getElementById("checkout-items-list");
  if (!checkoutForm || !itemsContainer) return;

  const items = CartService.getItems();

  // 1. Kiểm tra giỏ hàng
  if (items.length === 0) {
    itemsContainer.innerHTML = `
      <div class="text-center py-6 text-muted dark:text-muted-invert text-xs">
        Giỏ hàng rỗng. Không có sản phẩm nào để thanh toán.
      </div>
    `;
    const submitBtn = document.getElementById("btn-submit-order");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add("opacity-50", "pointer-events-none");
    }
    return;
  }

  // 2. Điền sẵn thông tin người dùng
  const user = UserService.getCurrentUser();
  if (user) {
    const nameEl = document.getElementById("checkout-fullname");
    const phoneEl = document.getElementById("checkout-phone");
    const emailEl = document.getElementById("checkout-email");

    if (nameEl) nameEl.value = user.fullname || "";
    if (phoneEl) phoneEl.value = user.phone || "";
    if (emailEl) emailEl.value = user.email || "";
  }

  // 3. Phí vận chuyển và render tóm tắt
  let shippingFee = 30000;
  const shippingRadios = document.querySelectorAll('input[name="shipping-method"]');
  shippingRadios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      shippingFee = e.target.value === "express" ? 50000 : 30000;
      updateSummary();
    });
  });

  renderItems();
  updateSummary();

  function renderItems() {
    itemsContainer.innerHTML = items
      .map(
        (item) => `
        <div class="flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-16 rounded bg-line/40 dark:bg-surface-invert shrink-0 flex items-center justify-center overflow-hidden shadow-sm">
              <img 
                src="${item.cover}" 
                alt="${item.title}" 
                class="w-full h-full object-cover" 
                onerror="this.parentElement.innerHTML='<span class=\\'font-bold text-[8px] text-muted text-center p-1\\'>${item.title}</span>'"
              />
            </div>
            <div>
              <h3 class="text-sm font-bold text-ink dark:text-ink-invert line-clamp-1">${item.title}</h3>
              <p class="text-xs text-muted dark:text-muted-invert">Số lượng: ${item.quantity}</p>
            </div>
          </div>
          <span class="text-sm font-bold text-ink dark:text-ink-invert whitespace-nowrap">
            ${(item.price * item.quantity).toLocaleString("vi-VN")} đ
          </span>
        </div>
      `
      )
      .join("");
  }

  function updateSummary() {
    const summary = CartService.getSummary(shippingFee, 0);

    const subtotalLabel = document.getElementById("checkout-subtotal-label");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const shippingEl = document.getElementById("checkout-shipping");
    const totalEl = document.getElementById("checkout-total");

    if (subtotalLabel) subtotalLabel.textContent = `Tạm tính (${summary.totalItems} sản phẩm)`;
    if (subtotalEl) subtotalEl.textContent = `${summary.subtotal.toLocaleString("vi-VN")} đ`;
    if (shippingEl) shippingEl.textContent = `${shippingFee.toLocaleString("vi-VN")} đ`;
    if (totalEl) totalEl.textContent = `${summary.total.toLocaleString("vi-VN")} đ`;
  }

  // 4. Bắt sự kiện nộp đơn hàng
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const currentItems = CartService.getItems();
    if (currentItems.length === 0) {
      showToast("Giỏ hàng của bạn đang trống!");
      return;
    }

    const shippingInfo = {
      fullname: document.getElementById("checkout-fullname").value,
      phone: document.getElementById("checkout-phone").value,
      email: document.getElementById("checkout-email").value,
      address: document.getElementById("checkout-address").value,
      note: document.getElementById("checkout-note").value || ""
    };

    const paymentMethodEl = document.querySelector('input[name="payment-method"]:checked');
    const paymentMethod = paymentMethodEl ? paymentMethodEl.value : "COD";
    const summary = CartService.getSummary(shippingFee, 0);

    // Tạo đơn hàng mới qua Service
    const newOrder = OrderService.createOrder(shippingInfo, paymentMethod, currentItems, summary);

    showToast(`Đặt hàng thành công! Mã đơn: #${newOrder.orderId}`);
    CartService.updateBadge();

    // Chuyển về trang profile sau 1.2s để xem lịch sử
    setTimeout(() => {
      window.location.href = "profile.html";
    }, 1200);
  });

  function handleRadioBorderEffect() {
  const radioGroups = ['shipping-method', 'payment-method'];

  radioGroups.forEach((groupName) => {
    const radios = document.querySelectorAll(`input[name="${groupName}"]`);

    function updateGroup() {
      radios.forEach((radio) => {
        const label = radio.closest("label");
        if (!label) return;

        if (radio.checked) {
          label.classList.add("border-accent-500", "bg-accent-500/5");
          label.classList.remove("border-line", "dark:border-line-invert-light");
        } else {
          label.classList.remove("border-accent-500", "bg-accent-500/5");
          label.classList.add("border-line", "dark:border-line-invert-light");
        }
      });
    }

    radios.forEach((radio) => radio.addEventListener("change", updateGroup));
    updateGroup(); // Kích hoạt ngay khi tải trang
  });
}
}