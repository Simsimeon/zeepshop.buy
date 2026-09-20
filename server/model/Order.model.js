const mongoose = require("mongoose");


const OrderSchema= new mongoose.Schema({
userId:String,
cartItem:[
    {
     productId:String,
     title:String,
     price:String,
     image:String,
     salePrice:String, 
     quantity:Number
    }
],
addressInfo:{
addressId:String,
address:String,
city:String,
postalCode:String,
phone:String,
note:String
},
orderStatus:String,
paymentMethod:String,
paymentStatus:String,
totalAmount:Number,
orderDate:Date,
orderUpdateDate:Date,
paymentId:String,
payerId:String
});


module.exports= mongoose.model("Order",OrderSchema)