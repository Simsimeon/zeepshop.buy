const {StatusCodes} =require("http-status-codes");
const userModel = require("../../model/user.model");
const bcrypt = require("bcryptjs");
const {  BadRequestError } = require("../../errors");
const { createUserInfo, attachCookiesToResponse } = require("../../utils/generateUserToken");
const register = async (req,res)=>{
  const {username , email ,password}=req.body;
  try{
    const alreadyRegistered = await userModel.findOne({email})
    if(alreadyRegistered){
        throw new BadRequestError("user already exist") 
    } 
    const salt = await bcrypt.genSalt(10);
     const hashPassword = await bcrypt.hash(password,salt)
    const user= await userModel.create({username,email,password:hashPassword}); 
    res.status(StatusCodes.CREATED).json({user})


  }catch(error){
    console.log('Error occur while registering',error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({msg:`Error occurred while registering,${error.message}`})
    
  }
}
const login = async (req,res)=>{
  const {email ,password}=req.body;
  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      return res.status(StatusCodes.UNAUTHORIZED).json({ msg: "Incorrect credentials" });
    }

    const userInfo = createUserInfo(user);
    attachCookiesToResponse({res, user:{userInfo}});

    return res.status(StatusCodes.OK).json({
      message: "Login successfully",
      user: userInfo,
    });
  }catch(error){
    console.log('Error occur while registering',error.message);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: error.message });
  }
}
const logout = async(req,res)=>{
  res.clearCookie("token", {
     httpOnly: true,
     secure: process.env.NODE_ENV === "production",
     signed: true,
     sameSite: "lax",
     path: "/",
  }).status(StatusCodes.OK).json({
    msg: "user logout successfully"
  });

}

module.exports ={register,login,logout}