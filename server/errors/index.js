const  UnauthorizedError = require("../errors/unauthorized");
const  UnauthenticatedError = require("../errors/unauthenticated");
const  BadRequestError = require("../errors/BadRequest");
const   NotFoundApiError = require("../errors/notfound");



module.exports={
    UnauthenticatedError,
    UnauthorizedError,
    BadRequestError,
    NotFoundApiError

}