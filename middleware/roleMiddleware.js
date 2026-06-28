const authorizedRole = (allowedRole)=>{
    return (request, response, next)=>{
        if(request.user.role !== allowedRole){
            return response.status(403).json({
                message: "Access Denied"
            })
        }
        next();
    }
}

module.exports = authorizedRole;