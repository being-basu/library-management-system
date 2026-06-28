const express = require("express");
const router = express.Router();

const {
  addBook,
  getAllBooks,
  getSpecificBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook
} = require("../controllers/bookController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizedRole = require("../middleware/roleMiddleware");

router.post("/", authenticateToken, authorizedRole("librarian"), addBook);
router.get("/", authenticateToken, getAllBooks);
router.get("/:id", authenticateToken, getSpecificBookById);
router.put("/:id", authenticateToken, authorizedRole("librarian"), updateBook);
router.delete(
  "/:id",
  authenticateToken,
  authorizedRole("librarian"),
  deleteBook,
);

router.post(
  "/:id/borrow",
  authenticateToken,
  authorizedRole("member"),
  borrowBook,
);
router.post(
  "/:id/return",
  authenticateToken,
  authorizedRole("member"),
  returnBook,
);

module.exports = router;
