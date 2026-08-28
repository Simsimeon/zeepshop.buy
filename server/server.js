require("dotenv").config()
const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const app = express();
const port = process.env.PORT || 5000;
const authRouter = require("./routes/auth/auth-routes")
app.use(
    cors({
        origin:"http://localhost:5173",
        methods:['GET',"POST","PUT","DELETE"],
        allowedHeaders:[
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials:true 
    })
)
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use('/api/auth',authRouter);
const startServer=async()=>{
    try{
        await connectDB(process.env.MONGOOSE_URI)
      app.listen(port, ()=>{
        console.log(`listening at port ${port}`);      
      })
    } catch(error){
        console.log(`Error while connecting to db`,error.message);
        
    }
}


startServer()