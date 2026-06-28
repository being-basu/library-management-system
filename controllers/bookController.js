const db = require("../config/db");

const addBook = (request, response, next) => {
  const { title, author, isbn, category, quantity, available_quantity } =
    request.body;
  if (!title || !author || !isbn) {
    return response.status(400).json({
      message: "Title, Author and ISBN are required",
    });
  }

  if (
    isNaN(quantity) ||
    isNaN(available_quantity) ||
    quantity < 0 ||
    available_quantity < 0
  ) {
    return response.status(400).json({
      message: "Quantity cannot be negative",
    });
  }
  const addBookQuery = `INSERT INTO books(title, author, isbn, category, quantity, available_quantity)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

  db.query(
    addBookQuery,
    [title, author, isbn, category, quantity, available_quantity],
    (error, results) => {
      if (error) {
        return next(error);
      }
      response.status(201).json({
        message: "Book Added Successfully",
      });
    },
  );
};

const getAllBooks = (request, response, next) => {
  const { search, category, page = 1, limit = 10 } = request.query;

  let query = `SELECT * FROM books WHERE 1=1`;
  const values = [];

  if (search) {
    query += ` AND (title LIKE ? OR author LIKE ?)`;
    values.push(`%${search}%`, `%${search}%`);
  }

  if (category) {
    query += ` AND category = ?`;
    values.push(category);
  }

  const offset = (page - 1) * limit;

  query += ` LIMIT ? OFFSET ?`;
  values.push(Number(limit), Number(offset));

  db.query(query, values, (error, results) => {
    if (error) {
      return next(error);
    }

    response.status(200).json(results);
  });
};

const getSpecificBookById = (request, response, next) => {
  const { id } = request.params;
  const getSpecificBookQuery = `SELECT * FROM books where id = ?`;

  db.query(getSpecificBookQuery, [id], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.length === 0) {
      return response.status(404).json({
        message: "Book Not Found",
      });
    }
    response.status(200).json(results[0]);
  });
};

const updateBook = (request, response, next) => {
  const { id } = request.params;
  const { available_quantity } = request.body;
  const updateBookQuery = `UPDATE books SET available_quantity = ?
    WHERE id = ?`;

  db.query(updateBookQuery, [available_quantity, id], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({
        message: "Book Not Found",
      });
    }
    response.status(200).json({
      message: "Update successful",
      id,
      available_quantity,
    });
  });
};

const deleteBook = (request, response, next) => {
  const { id } = request.params;
  const deleteBookQuery = `DELETE FROM books WHERE id = ?`;

  db.query(deleteBookQuery, [id], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.affectedRows === 0) {
      return response.status(404).json({
        message: "Book Not Found",
      });
    }
    response.status(200).json({
      message: "Book deleted successfully",
      id,
    });
  });
};
//Borrow logic
const borrowBook = (request, response, next) => {
  const { id: bookId } = request.params;
  const memberId = request.user.id;

  const borrowBookQuery = `SELECT * FROM books WHERE id = ?`;
  db.query(borrowBookQuery, [bookId], (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.length === 0) {
      return response.status(404).json({
        message: "Book Not Found",
      });
    }
    const book = results[0];
    if (book.available_quantity <= 0) {
      return response.status(400).json({
        message: "Book is not available",
      });
    }
    const borrowVerifyQuery = `SELECT * FROM borrow_records
        WHERE member_id = ? AND book_id = ? AND status='borrowed'`;
    db.query(borrowVerifyQuery, [memberId, bookId], (error, results) => {
      if (error) {
        return next(error);
      }
      if (results.length > 0) {
        return response.status(400).json({
          message: "Book is already borrowed by you",
        });
      }
      const insertBorrowQuery = `INSERT INTO borrow_records 
            (member_id , book_id , borrow_date, status)
            VALUES (?,?, NOW(),?)`;
      db.query(
        insertBorrowQuery,
        [memberId, bookId, "borrowed"],
        (error, results) => {
          if (error) {
            return next(error);
          }
          const updateQuantityQuery = `UPDATE books SET  available_quantity = available_quantity - 1
            WHERE id = ?`;
          db.query(updateQuantityQuery, [bookId], (error, results) => {
            if (error) {
              return next(error);
            }
            if (results.affectedRows === 0) {
              return response.status(404).json({
                message: "Book Not Found",
              });
            }
            response.status(200).json({
              message: "Book borrowed successfully",
            });
          });
        },
      );
    });
  });
};

const returnBook = (request, response, next) => {
  const { id: bookId } = request.params;
  const memberId = request.user.id;

  const checkBorrowQuery = `
    SELECT *
    FROM borrow_records
    WHERE member_id = ?
    AND book_id = ?
    AND status = 'borrowed'
  `;

  db.query(checkBorrowQuery, [memberId, bookId], (error, results) => {
    if (error) {
      return next(error);
    }

    if (results.length === 0) {
      return response.status(400).json({
        message: "You have not borrowed this book",
      });
    }

    const updateBorrowQuery = `
      UPDATE borrow_records
      SET status = 'returned',
          return_date = NOW()
      WHERE member_id = ?
      AND book_id = ?
      AND status = 'borrowed'
    `;

    db.query(updateBorrowQuery, [memberId, bookId], (error, results) => {
      if (error) {
        return next(error);
      }

      if (results.affectedRows === 0) {
        return response.status(400).json({
          message: "Borrow record not found",
        });
      }

      const updateBookQuery = `
        UPDATE books
        SET available_quantity = available_quantity + 1
        WHERE id = ?
      `;

      db.query(updateBookQuery, [bookId], (error, results) => {
        if (error) {
          return next(error);
        }

        if (results.affectedRows === 0) {
          return response.status(404).json({
            message: "Book Not Found",
          });
        }

        response.status(200).json({
          message: "Book returned successfully",
        });
      });
    });
  });
};

module.exports = {
  addBook,
  getAllBooks,
  getSpecificBookById,
  updateBook,
  deleteBook,
  borrowBook,
  returnBook,
};
