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
numOfReviews:{
        type:Number,
        required:true,
        default:0
    },
    averageRating:{
        type:Number,
        required:true,
        default:0
    },
  Brand:{type:String},
  price:{
  type:Number,
  default:0
},
  salePrice:{
    type:Number,
    default:0
},
  totalStock:{
    type:Number
 },
 user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
 productCreator:{
  type:String,
  required:true
 }   
},{timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}});
ProductSchema.pre('remove',async function(next){
    await this.model("Review").deleteMany({product: this._id})
})
ProductSchema.virtual("reviews",{
    ref:"Review",
    localField:"_id",
    foreignField:'product',
    justOne:false,
})



module.exports=mongoose.model("Product",ProductSchema);