 const CustomApiError = require("../errors/custom-api-error")
const {StatusCodes}= require("http-status-codes")
class UnauthorizedError extends  CustomApiError{
    constructor(message){
        super(message);
        this.status = StatusCodes.FORBIDDEN
        this.statusCode = StatusCodes.FORBIDDEN
    }
}

module.exports = UnauthorizedError;