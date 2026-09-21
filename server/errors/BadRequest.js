const  CustomApiError = require("../errors/custom-api-error")
const {StatusCodes}= require("http-status-codes")

class BadRequest extends  CustomApiError{
    constructor(message){
        super(message)
        this.status= StatusCodes.BAD_REQUEST
        this.statusCode= StatusCodes.BAD_REQUEST
    }
}
module.exports= BadRequest