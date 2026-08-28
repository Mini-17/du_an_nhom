import { UserService } from "../services/userService.js";
import { showToast } from "../modules/toast.js";

export function initAuthPage() {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const tabLoginBtn = document.getElementById("tab-login-btn");
  const tabRegisterBtn = document.getElementById("tab-register-btn");
  const authTitle = document.getElementById("auth-title");
  const authSubtitle = document.getElementById("auth-subtitle");

  // 1. Xử lý chuyển đổi Tab Đăng nhập <-> Đăng ký
  if (tabLoginBtn && tabRegisterBtn && loginForm && registerForm) {
    function switchTab(isLogin) {
      if (isLogin) {
        // Trạng thái Đăng Nhập
        loginForm.classList.remove("hidden");
        registerForm.classList.add("hidden");

        tabLoginBtn.className =
          "w-1/2 py-2.5 rounded-lg bg-surface dark:bg-line-invert text-accent-600 dark:text-accent-400 font-bold shadow-sm transition-all duration-300";
        tabRegisterBtn.className =
          "w-1/2 py-2.5 rounded-lg text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition-all duration-300";

        if (authTitle) authTitle.textContent = "Đăng Nhập Hệ Thống";
        if (authSubtitle) authSubtitle.textContent = "Chào mừng bạn quay trở lại Tổ Sách BookNest!";
      } else {
        // Trạng thái Đăng Ký
        loginForm.classList.add("hidden");
        registerForm.classList.remove("hidden");

        tabRegisterBtn.className =
          "w-1/2 py-2.5 rounded-lg bg-surface dark:bg-line-invert text-accent-600 dark:text-accent-400 font-bold shadow-sm transition-all duration-300";
        tabLoginBtn.className =
          "w-1/2 py-2.5 rounded-lg text-muted dark:text-muted-invert hover:text-ink dark:hover:text-ink-invert transition-all duration-300";

        if (authTitle) authTitle.textContent = "Đăng Ký Thành Viên";
        if (authSubtitle) authSubtitle.textContent = "Trở thành tổ viên của Tổ Sách Cozy ngay hôm nay!";
      }
    }

    tabLoginBtn.addEventListener("click", () => switchTab(true));
    tabRegisterBtn.addEventListener("click", () => switchTab(false));
  }

  // 2. Xử lý nộp Form Đăng Nhập
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email")?.value.trim();
      const password = document.getElementById("login-password")?.value;

      if (!email || !password) {
        showToast("Vui lòng nhập đầy đủ email và mật khẩu!");
        return;
      }

      const result = UserService.login(email, password);
      if (result.success) {
        showToast("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => {
          window.location.href = "profile.html";
        }, 1000);
      } else {
        showToast(result.message || "Email hoặc mật khẩu không chính xác!");
      }
    });
  }

  // 3. Xử lý nộp Form Đăng Ký
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const fullname = document.getElementById("reg-fullname")?.value.trim();
      const email = document.getElementById("reg-email")?.value.trim();
      const phone = document.getElementById("reg-phone")?.value.trim();
      const password = document.getElementById("reg-password")?.value;
      const repassword = document.getElementById("reg-repassword")?.value;

      if (!fullname || !email || !phone || !password) {
        showToast("Vui lòng điền đầy đủ các trường thông tin!");
        return;
      }

      if (password !== repassword) {
        showToast("Mật khẩu nhập lại không trùng khớp!");
        return;
      }

      const result = UserService.register({ fullname, email, phone, password });
      if (result.success) {
        showToast("Đăng ký thành công! Hãy đăng nhập ngay.");
        // Chuyển lại tab Đăng Nhập và điền sẵn email
        document.getElementById("login-email").value = email;
        document.getElementById("login-password").value = "";
        tabLoginBtn?.click();
      } else {
        showToast(result.message || "Email này đã tồn tại trong hệ thống!");
      }
    });
  }

  // 4. Xử lý Đăng Xuất (ở trang Profile)
  const logoutBtn = document.querySelector('a[href="login.html"]');
  if (logoutBtn && window.location.pathname.includes("profile.html")) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      UserService.logout();
      showToast("Đã đăng xuất tài khoản!");
      setTimeout(() => {
        window.location.href = "login.html";
      }, 800);
    });
  }
}