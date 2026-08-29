const jwt = require("jsonwebtoken");

const authMiddleware = async(req,res,next)=>{
   const token = req.signedCookies?.token;
   
    
    
    
    
    if(!token){
       return res.status(401).json({msg:"Unauthorized user"})
    }
    try{
       const decodeCookie = jwt.verify(token,process.env.JWT_SECRET)
       req.user=decodeCookie;
       next()
    }catch(error){
          res.status(401).json({msg:"Unauthorized user"})
    }
}
module.exports = authMiddleware