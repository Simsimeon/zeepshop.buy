const mongoose = require("mongoose");


const ProductReviewSchema = new mongoose.Schema({
 rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'Please provide ratings']
    },
     title:{
        type:String,
        trim:true,
        maxlength:1000,
         required:[true,'Title can not be empty ']
    },
     comment:{
        type:String,
        required:[true,'Please a comment '],
         maxlength:1000,
    },
    user:{
     type: mongoose.Schema.ObjectId,
    ref:"Users",
     required:true
    },
     product:{
     type: mongoose.Schema.ObjectId,
     ref:"Product",
     required:true
    }
});


ProductReviewSchema.index({product:1,user:1},{unique:true})


ProductReviewSchema.statics.calculateAverageRating = async function(productId){

  const result =await this.aggregate([
{$match:{product:productId}},
{$group:{
    _id:null,
    averageRating:{$avg:"$rating"},
     numOfReviews:{$sum:1}

}}


  ]) 

  
  try{
    await this.model('Product').findOneAndUpdate({_id:productId},{
        averageRating:Math.ceil(result[0]?.averageRating || 0),
        numOfReviews:Math.ceil(result[0]?.numOfReviews || 0)
    })
  }catch(err){
   console.log(err);
   

  }
  
}

ProductReviewSchema.post("save",async function(){
    await this.constructor.calculateAverageRating(this.product)
    
})

ProductReviewSchema.post("remove",async function(){
    await this.constructor.calculateAverageRating(this.product)
    
})
module.exports= mongoose.model("Review",ProductReviewSchema)