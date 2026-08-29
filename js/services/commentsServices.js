(() => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get("id") || "default";
  const STORAGE_KEY = `booknest_comments_${bookId}`;

  const form = document.getElementById("comment-form");
  const nameInput = document.getElementById("comment-name");
  const contentInput = document.getElementById("comment-content");
  const ratingBox = document.getElementById("comment-rating");
  const stars = ratingBox ? [...ratingBox.querySelectorAll(".comment-star")] : [];
  const list = document.getElementById("comment-list");
  const emptyState = document.getElementById("comment-empty");
  const template = document.getElementById("comment-template");
  const countBadge = document.getElementById("comment-count");

  if (!form || !list || !template) return;

  let currentRating = 0;

  function paintStars(value) {
    stars.forEach((star) => {
      const starValue = Number(star.dataset.star);
      if (starValue <= value) {
        star.classList.add("text-accent-500");
        star.classList.remove("text-line", "dark:text-line-invert");
      } else {
        star.classList.remove("text-accent-500");
        star.classList.add("text-line", "dark:text-line-invert");
      }
    });
  }

  stars.forEach((star) => {
    star.addEventListener("mouseenter", () => paintStars(Number(star.dataset.star)));
    star.addEventListener("mouseleave", () => paintStars(currentRating));
    star.addEventListener("click", () => {
      currentRating = Number(star.dataset.star);
      ratingBox.dataset.rating = String(currentRating);
      paintStars(currentRating);
    });
  });

  function loadComments() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveComments(comments) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  }

  function renderComments() {
    const comments = loadComments();

    list.querySelectorAll(".comment-item").forEach((el) => el.remove());

    if (comments.length === 0) {
      emptyState.classList.remove("hidden");
    } else {
      emptyState.classList.add("hidden");

      comments
        .slice()
        .reverse()
        .forEach((comment) => {
          const node = template.content.cloneNode(true);

          node.querySelector(".comment-avatar-letter").textContent =
            comment.name.trim().charAt(0).toUpperCase() || "?";
          node.querySelector(".comment-name").textContent = comment.name;
          node.querySelector(".comment-date").textContent = comment.date;
          node.querySelector(".comment-content").textContent = comment.content;
          node.querySelector(".comment-stars").textContent =
            "★".repeat(comment.rating) + "☆".repeat(5 - comment.rating);

          list.appendChild(node);
        });
    }

    if (countBadge) {
      countBadge.textContent = `${comments.length} bình luận`;
    }
  }

  // ---- Gửi bình luận mới ----
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const content = contentInput.value.trim();

    if (!name || !content) return;

    const comments = loadComments();
    comments.push({
      name,
      content,
      rating: currentRating || 5,
      date: new Date().toLocaleDateString("vi-VN"),
    });

    saveComments(comments);
    renderComments();

    form.reset();
    currentRating = 0;
    paintStars(0);
  });

  renderComments();
})();