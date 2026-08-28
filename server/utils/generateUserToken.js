const jwt = require("jsonwebtoken");

function createUserInfo (user){
 return{
   userId:user._id,
       role:user.role ,
     email:user.email
 }


}


function generateUserToken ({payload}){
     const userToken = jwt.sign(payload,process.env.JWT_SECRET,
        {expiresIn:"1d"}
     ) ; 
     return userToken
}

function attachCookiesToResponse ({res,user}){
const userToken = generateUserToken({payload:user})
res.cookie('token',userToken,{
       httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      signed:true,
       maxAge: 7 * 24 * 60 * 60 * 1000 
    });
}

module.exports ={
    attachCookiesToResponse,
    createUserInfo
}