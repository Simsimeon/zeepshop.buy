const CustomApiError = require("../errors/custom-api-error")
const {StatusCodes}= require("http-status-codes");


class UnauthenticatedError extends CustomApiError {
    constructor(message){
        super(message)
        this.status=StatusCodes.UNAUTHORIZED
        this.statusCode=StatusCodes.UNAUTHORIZED
    }
}

module.exports = UnauthenticatedError;


