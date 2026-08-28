const USER_KEY = "booknest_current_user";
const USERS_LIST_KEY = "booknest_users_list";

const defaultUser = {
  fullname: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  phone: "0901234567",
  birthday: "15/08/1995",
  password: "password123"
};

export const UserService = {
  getCurrentUser() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : defaultUser;
  },

  updateProfile(updatedInfo) {
    const current = this.getCurrentUser();
    const newUser = { ...current, ...updatedInfo };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    return newUser;
  },

  register(userData) {
    const rawList = localStorage.getItem(USERS_LIST_KEY);
    const users = rawList ? JSON.parse(rawList) : [defaultUser];

    const exists = users.some((u) => u.email === userData.email);
    if (exists) {
      return { success: false, message: "Email này đã được đăng ký!" };
    }

    users.push(userData);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    return { success: true };
  },

  login(email, password) {
    const rawList = localStorage.getItem(USERS_LIST_KEY);
    const users = rawList ? JSON.parse(rawList) : [defaultUser];

    // Cho phép đăng nhập bằng tài khoản mặc định hoặc tài khoản vừa đăng ký
    const matched = users.find((u) => u.email === email);
    if (matched) {
      localStorage.setItem(USER_KEY, JSON.stringify(matched));
      return { success: true, user: matched };
    }

    return { success: false, message: "Email hoặc mật khẩu không chính xác!" };
  },

  logout() {
    localStorage.removeItem(USER_KEY);
  }
};