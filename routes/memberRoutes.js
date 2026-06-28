const express = require("express");
const router = express.Router();

const {
  getMembers,
  deleteMember,
  getMyBorrowedBooks,
} = require("../controllers/memberController");
const authenticateToken = require("../middleware/authMiddleware");
const authorizedRole = require("../middleware/roleMiddleware");

router.get('/', authenticateToken, authorizedRole("librarian"), getMembers);
router.delete('/:id', authenticateToken, authorizedRole("librarian"), deleteMember);
router.get("/me/books", authenticateToken, authorizedRole("member"),getMyBorrowedBooks);


module.exports = router;
