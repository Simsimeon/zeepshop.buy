const mongoose =require("mongoose");


const HeroImageSchema = new mongoose.Schema({
    image:String,
},{timestamps:true});

module.exports = mongoose.model("HeroImage",HeroImageSchema);