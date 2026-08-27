const ORDERS_KEY = "booknest_orders";

// Danh sách lịch sử đơn hàng mẫu ban đầu
const DEFAULT_ORDERS = [
  {
    orderId: "BN-8893",
    createdAt: "12/03/2026",
    booksSummary: "Tuổi Trẻ Đáng Giá Bao Nhiêu? (x1), Mắt Biếc (x1)",
    totalAmount: 160000,
    status: "Đã giao"
  },
  {
    orderId: "BN-8712",
    createdAt: "01/02/2026",
    booksSummary: "Hiểu Về Trái Tim (x1)",
    totalAmount: 116000,
    status: "Đang xử lý"
  },
  {
    orderId: "BN-8521",
    createdAt: "15/12/2025",
    booksSummary: "Cây Cam Ngọt Của Tôi (x1), Nhà Giả Kim (x2)",
    totalAmount: 223400,
    status: "Đã hủy"
  }
];

export const OrderService = {
  // Lấy danh sách lịch sử đơn hàng
  getOrders() {
    let orders = localStorage.getItem(ORDERS_KEY);
    if (!orders) {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(DEFAULT_ORDERS));
      return DEFAULT_ORDERS;
    }
    return JSON.parse(orders);
  },

  // Tạo đơn hàng mới từ giỏ hàng
  createOrder(shippingInfo, paymentMethod, cartItems, summary) {
    const orders = this.getOrders();
    const booksSummary = cartItems
      .map((item) => `${item.title} (x${item.quantity})`)
      .join(", ");

    const newOrder = {
      orderId: "BN-" + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toLocaleDateString("vi-VN"),
      shippingInfo,
      paymentMethod,
      booksSummary,
      totalAmount: summary.total,
      status: "Đang xử lý"
    };

    orders.unshift(newOrder); // Đẩy đơn mới lên đầu danh sách
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    // Làm rỗng giỏ hàng sau khi đặt thành công
    localStorage.removeItem("booknest_cart");
    return newOrder;
  }
};