const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
username:{
 type:String,
 required:true,
 minLength:[4, "username should at least eight characters long"],
 unique: true
},
email:{
type:String,
 required:true,
 unique: true
},
password:{
type:String,
 required:true,
 minLength:[5, "Password should at least five characters long"],
},
role:{
  type:String,
  default:"user"  
}
}) 


module.exports = mongoose.model("Users",UserSchema)