import { UserService } from "../services/userService.js";
import { OrderService } from "../services/orderService.js";
import { showToast } from "../modules/toast.js";

export function initProfilePage() {
  const profileForm = document.getElementById("profile-form");
  const ordersTableBody = document.getElementById("orders-history-tbody");

  // 1. Tải và điền thông tin người dùng vào Form
  const user = UserService.getCurrentUser();
  if (user) {
    const nameInput = document.getElementById("fullname");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const birthdayInput = document.getElementById("birthday");

    if (nameInput) nameInput.value = user.fullname || "";
    if (emailInput) emailInput.value = user.email || "";
    if (phoneInput) phoneInput.value = user.phone || "";
    if (birthdayInput) birthdayInput.value = user.birthday || "";
  }

  // 2. Bắt sự kiện cập nhật thông tin hồ sơ
  profileForm?.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      fullname: document.getElementById("fullname")?.value.trim(),
      email: document.getElementById("email")?.value.trim(),
      phone: document.getElementById("phone")?.value.trim(),
      birthday: document.getElementById("birthday")?.value.trim()
    };

    UserService.updateProfile(updatedData);
    showToast("Cập nhật thông tin hồ sơ thành công!");
  });

  // 3. Render danh sách lịch sử đơn hàng
  renderOrdersHistory();

  function renderOrdersHistory() {
    if (!ordersTableBody) return;

    const orders = OrderService.getOrders();

    if (orders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="py-8 text-center text-muted dark:text-muted-invert">
            Bạn chưa có đơn hàng nào trong lịch sử.
          </td>
        </tr>
      `;
      return;
    }

    ordersTableBody.innerHTML = orders
      .map((order) => {
        // Màu sắc huy hiệu trạng thái
        let badgeColor = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
        if (order.status === "Đã giao") {
          badgeColor = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        } else if (order.status === "Đã hủy") {
          badgeColor = "bg-rose-500/10 text-rose-600 dark:text-rose-400";
        }

        return `
          <tr class="hover:bg-line/20 dark:hover:bg-surface-invert/40 transition">
            <td class="py-4 pr-4 font-bold text-ink dark:text-ink-invert">#${order.orderId}</td>
            <td class="py-4 px-4 text-muted dark:text-muted-invert">${order.createdAt}</td>
            <td class="py-4 px-4 text-ink dark:text-ink-invert font-medium max-w-xs truncate" title="${order.booksSummary}">
              ${order.booksSummary}
            </td>
            <td class="py-4 px-4 font-bold text-ink dark:text-ink-invert">
              ${order.totalAmount.toLocaleString("vi-VN")} đ
            </td>
            <td class="py-4 pl-4 text-right">
              <span class="inline-block px-3 py-1 rounded-full font-bold text-[11px] ${badgeColor}">
                ${order.status}
              </span>
            </td>
          </tr>
        `;
      })
      .join("");
  }
}