const CustomApiError = require("../errors/custom-api-error")
const {StatusCodes}= require("http-status-codes");


class NotFoundApiError extends CustomApiError{
    constructor(message){
        super(message)
        this.status = StatusCodes.NOT_FOUND
    }
};

module.exports=NotFoundApiError;