# Library Management System API

## Project Overview

A RESTful Library Management System built using Node.js, Express.js, and MySQL. The application supports authentication, role based authorization, book management, member management, and book borrowing and returning. JWT is used for secure authentication, and passwords are encrypted using bcrypt.

## Technologies Used

* Node.js
* Express.js
* MySQL
* JWT (JSON Web Token)
* bcrypt
* mysql2
* dotenv
* validator

## Features

* User Registration and Login
* JWT Authentication
* Role Based Authorization
* Book CRUD Operations
* Borrow and Return Books
* Member Management
* Input Validation
* Centralized Error Handling
* Pagination
* Book Search
* Category Filter

## Installation

```bash
git clone https://github.com/being-basu/library-management-system.git
cd library-management-system
npm install
npm start
```

## Environment Variables

Create a `.env` file:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=library_management

JWT_SECRET=your_secret_key
```

## Database Setup

1. Create a MySQL database named `library_management`.
2. Import the SQL file into MySQL.
3. Update the `.env` file with your database credentials.
4. Run the application.

## API Endpoints

### Authentication

| Method | Endpoint           |
| ------ | ------------------ |
| POST   | /api/auth/register |
| POST   | /api/auth/login    |

### Books

| Method | Endpoint              |
| ------ | --------------------- |
| POST   | /api/books            |
| GET    | /api/books            |
| GET    | /api/books/:id        |
| PUT    | /api/books/:id        |
| DELETE | /api/books/:id        |
| POST   | /api/books/:id/borrow |
| POST   | /api/books/:id/return |

### Members

| Method | Endpoint             |
| ------ | -------------------- |
| GET    | /api/members         |
| DELETE | /api/members/:id     |
| GET    | /api/members/mybooks |

## Authentication Flow

1. Register a new user.
2. Login using email and password.
3. Receive a JWT token.
4. Pass the token in the Authorization header.

Example:

```
Authorization: Bearer <JWT_TOKEN>
```

## Deployment URL

https://library-management-system-production-ecf4.up.railway.app

## GitHub Repository

https://github.com/being-basu/library-management-system

## Postman Collection

Include your exported Postman Collection JSON file in the repository or submission.

## Author

Basu Patra
