const errorHandler = (error, request, response, next)=>{
    console.error(error);

    response.status(error.status || 500).json({
        success: false,
        message: error.message || "Internal Server Error"
    });
};

module.exports = errorHandler;