const  UnauthorizedError = require("../errors/unauthorized");
const  UnauthenticatedError = require("../errors/unauthenticated");
const  BadRequestError = require("../errors/BadRequest");
const   NotFoundError = require("../errors/notfound");



module.exports={
    UnauthenticatedError,
    UnauthorizedError,
    BadRequestError,
    NotFoundError

}