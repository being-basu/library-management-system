const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

//Registration
const registerUser = (request, response, next) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return response.status(400).json({
      message: "All fields are required",
    });
  }
  if (!validator.isEmail(email)) {
    return response.status(400).json({
      message: "Invalid email format",
    });
  }
  if (password.length < 6) {
    return response.status(400).json({
      message: "Password must be at least 6 characters long",
    });
  }
  const checkEmailQuery = "SELECT * FROM users WHERE email = ?";

  db.query(checkEmailQuery, [email], async (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.length > 0) {
      return response.status(400).json({
        message: "User already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const createUserQuery = `
            INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
    db.query(
      createUserQuery,
      [name, email, hashedPassword],
      (error, results) => {
        if (error) {
          return next(error);
        }
        response.status(201).json({
          message: "User Registered Successfully",
        });
      },
    );
  });
};

//Login
const loginUser = (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return response.status(400).json({
      message: "Email and password are required",
    });
  }
  if (!validator.isEmail(email)) {
    return response.status(400).json({
      message: "Invalid email format",
    });
  }
  const getUserQuery = `SELECT * FROM users WHERE email=?`;
  db.query(getUserQuery, [email], async (error, results) => {
    if (error) {
      return next(error);
    }
    if (results.length === 0) {
      return response.status(400).json({
        message: "User doesn't exist.",
      });
    }
    const user = results[0];

    const isPasswordLegit = await bcrypt.compare(password, user.password);
    if (!isPasswordLegit) {
      return response.status(400).json({
        message: "Invalid Password",
      });
    }
    const payload = {
      id: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    response.status(200).json({
      message: "Login successful",
      token,
    });
  });
};

module.exports = {
  registerUser,
  loginUser,
};
