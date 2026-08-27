export const BookService = {
  // 1. Lấy toàn bộ danh sách sách
  async getAllBooks() {
    try {
      const res = await fetch("data/books.json");
      if (!res.ok) throw new Error("Không thể tải tệp books.json");
      return await res.json();
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu sách:", error);
      return [];
    }
  },

  // 2. Lấy chi tiết 1 cuốn sách theo ID
  async getBookById(id) {
    const books = await this.getAllBooks();
    return books.find((book) => book.id === id) || null;
  },

  // 3. Lọc sách theo thể loại hoặc tác giả
  async filterBooks(category = null, author = null) {
    const books = await this.getAllBooks();
    return books.filter((book) => {
      const matchCat = category ? book.category === category : true;
      const matchAuthor = author ? book.author === author : true;
      return matchCat && matchAuthor;
    });
  }
};