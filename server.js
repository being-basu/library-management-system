const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./config/db");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const memberRoutes = require("./routes/memberRoutes");
const authenticateToken =  require("./middleware/authMiddleware");
const authorizedRole = require("./middleware/roleMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/members", memberRoutes);


db.connect((error)=>{
    if (error){
        console.log("Database connection failed");
        console.log(error);
        return;
    }
    console.log("Connected to MySQL");
});


app.get("/", (request, response) => {
    response.send("Testing Library management API");
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`);
})

//Testing
app.get('/test', authenticateToken, (request, response)=>{
    response.json({
        message: "Testing authentication route"
    })
})
app.post('/role-test', authenticateToken, authorizedRole("librarian"), (request, response)=>{
    response.json({
      message:
        "Librarian Access Granted",
      user: request.user
    });
});
app.use(errorHandler);