const jwt = require("jsonwebtoken");

const authenticateToken = (request, response, next)=>{
    const authHeader = request.headers["authorization"];

    if (!authHeader){
        return response.status(401).json({
        message: "Access token missing"
        });
    }
    const token = authHeader.split(" ")[1];
    try {
        const verification = jwt.verify(
            token,
            process.env.JWT_SECRET
        )
        request.user = verification;
        next();
    }catch(error){
         return response.status(401).json({
        message: "Invalid token"
        });
    }
}


module.exports = authenticateToken;