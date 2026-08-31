const mongoose = require("mongoose");



const ProductSchema= new mongoose.Schema({
  image:{
    type:String,
    required:[true,"Please provide image url"],
},
  title:{
    type:String,
     required:[true,"Please provide product title"],
},
  description:{
    type:String,
    maxlength:[1000,"Description can not be more 1000 characters long"],
    required:[true,'Please provide product description'],
},
  category:{
    type:String
},
  Brand:{type:String},
  price:{
  type:Number,
    default:0
},
  salePrice:{
    type:Number,
},
  totalStock:{
    type:Number
 },
 user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
},{timestamps:true});



module.exports=mongoose.model("Product",ProductSchema);