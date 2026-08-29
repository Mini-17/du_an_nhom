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
  // Lấy danh sách toàn bộ người dùng
  getUsersList() {
    const rawList = localStorage.getItem(USERS_LIST_KEY);
    if (!rawList) {
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify([defaultUser]));
      return [defaultUser];
    }
    return JSON.parse(rawList);
  },

  getCurrentUser() {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : defaultUser;
  },

  updateProfile(updatedInfo) {
    const current = this.getCurrentUser();
    const newUser = { ...current, ...updatedInfo };
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));

    // Đồng bộ lại vào danh sách users
    const users = this.getUsersList();
    const index = users.findIndex((u) => u.email === current.email);
    if (index !== -1) {
      users[index] = newUser;
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    }

    return newUser;
  },

  register(userData) {
    const users = this.getUsersList();

    const exists = users.some((u) => u.email === userData.email);
    if (exists) {
      return { success: false, message: "Email này đã được đăng ký!" };
    }

    users.push(userData);
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(users));
    return { success: true };
  },

  login(email, password) {
    const users = this.getUsersList();

    // Kiểm tra chính xác cả Email và Password
    const matched = users.find((u) => u.email === email && u.password === password);
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