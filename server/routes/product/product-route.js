const express = require("express");
const Routes = express.Router();
const {handleImageUpload,addProduct,deleteProduct,editProduct,fetchAllProduct}=require("../../controllers/admin/product-controller");
const {upload}= require("../../helpers/cloudinary");


Routes.post("/upload-product-image",upload.single("my_filez"),handleImageUpload)
Routes.post("/addproduct",addProduct);
Routes.put("/editproduct/:id",editProduct);
Routes.delete("/deleteproduct/:id",deleteProduct);
Routes.get("/getallproduct",fetchAllProduct);



module.exports = Routes;