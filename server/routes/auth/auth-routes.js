const express=require("express");
const { register, login,logout } = require("../../controllers/auth/auth-controller");
const authMiddleware = require("../../utils/authMiddleware")
const Route = express.Router();




Route.post("/register",register);
Route.post("/login",login);
Route.post("/logout",logout);
Route.get("/check",authMiddleware,async(req,res)=>{
    const user = req.user;
    res.status(200).json({
        message:"authenticated user",
        success:true,
        user
    })
})
module.exports = Route