const CURRENT_USER_KEY = "booknest_current_user";

// Dữ liệu người dùng mẫu mặc định ban đầu
const DEFAULT_USER = {
  id: "BN9923",
  fullname: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
  phone: "0901234567",
  birthday: "15/08/1995",
  rank: "Tổ viên thân thiết"
};

export const UserService = {
  // Lấy người dùng hiện tại (nếu chưa có thì nạp mặc định)
  getCurrentUser() {
    let user = localStorage.getItem(CURRENT_USER_KEY);
    if (!user) {
      this.setCurrentUser(DEFAULT_USER);
      return DEFAULT_USER;
    }
    return JSON.parse(user);
  },

  // Lưu thông tin người dùng
  setCurrentUser(user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  },

  // Cập nhật thông tin hồ sơ cá nhân
  updateProfile(newData) {
    const currentUser = this.getCurrentUser();
    const updatedUser = { ...currentUser, ...newData };
    this.setCurrentUser(updatedUser);
    return updatedUser;
  }
};