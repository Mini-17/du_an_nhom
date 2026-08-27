import { showToast } from "../modules/toast.js";

const CART_STORAGE_KEY = "booknest_cart";

export const CartService = {
  // Lấy danh sách sản phẩm trong giỏ
  getItems() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  },

  // Thêm sách vào giỏ
  addItem(book, quantity = 1) {
    const cart = this.getItems();
    const existingItem = cart.find((item) => item.id === book.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: book.id,
        title: book.title,
        author: book.author || "",
        price: book.price,
        cover: book.cover || "",
        quantity: quantity
      });
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    this.updateBadge();
    showToast(`Đã thêm "${book.title}" vào giỏ hàng!`);
  },

  // Cập nhật số lượng (+ / -)
  updateQuantity(id, quantity) {
    let cart = this.getItems();
    if (quantity <= 0) {
      this.removeItem(id);
      return;
    }
    const item = cart.find((i) => i.id === id);
    if (item) {
      item.quantity = quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      this.updateBadge();
    }
  },

  // Xóa sản phẩm khỏi giỏ
  removeItem(id) {
    const cart = this.getItems().filter((item) => item.id !== id);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    this.updateBadge();
    showToast("Đã xóa sản phẩm khỏi giỏ hàng.");
  },

  // Tính toán tóm tắt đơn hàng
  getSummary(shippingFee = 30000, discount = 0) {
    const cart = this.getItems();
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const total = Math.max(0, subtotal + shippingFee - discount);

    return { subtotal, totalItems, shippingFee, discount, total };
  },

  // Đồng bộ số lượng lên badge Header & Bottom Bar
  updateBadge() {
    const badges = document.querySelectorAll("[data-cart-count]");
    const totalItems = this.getItems().reduce((sum, item) => sum + item.quantity, 0);
    badges.forEach((badge) => {
      badge.textContent = totalItems;
      badge.classList.toggle("hidden", totalItems === 0);
    });
  }
};