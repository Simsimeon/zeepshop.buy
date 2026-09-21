require("dotenv").config()
const express = require("express");
const connectDB = require("./db/connectDB");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const app = express();
const port = process.env.PORT || 5000;
const authRouter = require("./routes/auth/auth-routes");
const adminProductRouter = require("./routes/product/product-route")
const shopProductRouter = require("./routes/shop/products-routes");
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundRoute= require("./middleware/not-foundroute");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const searchProductRouter=require("./routes/shop/search-routes");
const reviewRouter = require("./routes/review/review-routes");
const heroImageRouter = require("./routes/common/heroimage");
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true
    })
)
app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use('/api/auth',authRouter);
app.use('/api/admin/products',adminProductRouter);
app.use('/api/shop/products',shopProductRouter);
app.use('/api/shop/cart',shopCartRouter);
app.use('/api/shop/address',shopAddressRouter);
app.use('/api/shop/order',shopOrderRouter);
app.use('/api/shop/search',searchProductRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/heroimage', heroImageRouter);
app.use(notFoundRoute)
app.use(errorHandlerMiddleware)
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