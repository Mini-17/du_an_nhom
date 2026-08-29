import { UserService } from "../services/userService.js";
import { OrderService } from "../services/orderService.js";
import { showToast } from "../modules/toast.js";

export function initProfilePage() {
  const profileForm = document.getElementById("profile-form");
  if (!profileForm) return;

  const nameInput = document.getElementById("fullname");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const birthdayInput = document.getElementById("birthday");

  const avatarDisplay = document.getElementById("profile-avatar");
  const nameDisplay = document.getElementById("profile-name");
  const logoutBtn = document.getElementById("btn-logout");
  const ordersTableBody = document.getElementById("orders-history-tbody");

  // 1. Hàm nạp và đồng bộ dữ liệu người dùng lên Form & Sidebar
  function loadUserData() {
    const user = UserService.getCurrentUser();
    if (user) {
      if (nameInput) nameInput.value = user.fullname || "";
      if (emailInput) emailInput.value = user.email || "";
      if (phoneInput) phoneInput.value = user.phone || "";
      if (birthdayInput) birthdayInput.value = user.birthday || "";

      // Cập nhật tên hiển thị và chữ cái đầu cho Avatar bên Sidebar
      if (nameDisplay) nameDisplay.textContent = user.fullname || "Người dùng";
      if (avatarDisplay) {
        const firstLetter = (user.fullname || "A").trim().charAt(0).toUpperCase();
        avatarDisplay.textContent = firstLetter;
      }
    }
  }

  // Nạp dữ liệu lúc đầu
  loadUserData();

  // 2. Xử lý khi nhấn nút "Cập Nhật Thông Tin"
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const updatedData = {
      fullname: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      birthday: birthdayInput.value.trim()
    };

    // Lưu vào UserService / localStorage
    UserService.updateProfile(updatedData);

    // Cập nhật ngay lập tức giao diện Sidebar
    loadUserData();

    // Hiển thị thông báo
    showToast("Đã cập nhật thông tin hồ sơ thành công!");
  });

  // 3. Xử lý Đăng xuất
  logoutBtn?.addEventListener("click", () => {
    UserService.logout();
    showToast("Đã đăng xuất tài khoản!");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });

  // 4. Render bảng lịch sử đơn hàng
  if (ordersTableBody) {
    const orders = OrderService.getOrders();
    if (!orders || orders.length === 0) {
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="5" class="py-8 text-center text-muted dark:text-muted-invert">Bạn chưa có đơn hàng nào.</td>
        </tr>
      `;
    } else {
      ordersTableBody.innerHTML = orders
        .map((order) => {
          let statusBadge = "bg-amber-500/10 text-amber-600 dark:text-amber-400";
          if (order.status === "Đã giao") statusBadge = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
          if (order.status === "Đã hủy") statusBadge = "bg-rose-500/10 text-rose-600 dark:text-rose-400";

          return `
            <tr class="hover:bg-line/20 dark:hover:bg-surface-invert/40 transition">
              <td class="py-4 pr-4 font-bold text-ink dark:text-ink-invert">#${order.orderId}</td>
              <td class="py-4 px-4 text-muted dark:text-muted-invert">${order.createdAt}</td>
              <td class="py-4 px-4 text-ink dark:text-ink-invert font-medium max-w-xs truncate">${order.booksSummary}</td>
              <td class="py-4 px-4 font-bold text-ink dark:text-ink-invert">${order.totalAmount.toLocaleString("vi-VN")} đ</td>
              <td class="py-4 pl-4 text-right">
                <span class="inline-block px-3 py-1 rounded-full font-bold text-[11px] ${statusBadge}">
                  ${order.status}
                </span>
              </td>
            </tr>
          `;
        })
        .join("");
    }
  }
}