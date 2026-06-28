const db = require("../config/db");

const getMembers = (request, response, next)=>{
    const getMemberQuery = `SELECT * FROM users WHERE role = ?`;
     db.query(getMemberQuery, ["member"], (error, results)=>{
        if (error) {
          return next(error);
        }
        response.status(200).json(results)
     })
}

const deleteMember = (request, response, next)=>{
    const {id} = request.params

    const deleteMemberQuery = `DELETE FROM users WHERE id=? AND role = ?`;
    db.query(deleteMemberQuery, [id, 'member'], (error, results)=>{
        if (error) {
          return next(error);
        }
        if (results.affectedRows === 0) {
            return response.status(404).json({
            message: "Member Not Found"
        });
}
        response.status(200).json({
                message: "Member deleted successfully"
        })
    })
}

const getMyBorrowedBooks = (request, response, next) =>{
    const memberId = request.user.id;

    const getBorrowedBooksQuery = `
    SELECT
      books.id,
      books.title,
      books.author,
      books.category,
      books.isbn,
      borrow_records.borrow_date
    FROM books INNER JOIN borrow_records 
    ON books.id = borrow_records.book_id
    WHERE borrow_records.member_id = ?
    AND borrow_records.status = 'borrowed'
    `;
    db.query(getBorrowedBooksQuery, [memberId], (error, results) => {
      if (error) {
        return next(error);
      }
      response.status(200).json(results);
    });
}


module.exports = { getMembers, deleteMember, getMyBorrowedBooks }; 