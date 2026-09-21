const CustomApiError = require("../errors/custom-api-error")
const {StatusCodes}= require("http-status-codes");


class NotFoundError extends CustomApiError{
    constructor(message){
        super(message)
        this.status = StatusCodes.NOT_FOUND
        this.statusCode = StatusCodes.NOT_FOUND
    }
};

module.exports=NotFoundError;