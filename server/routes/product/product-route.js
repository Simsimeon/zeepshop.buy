const express = require("express");
const Routes = express.Router();
const {handleImageUpload,addProduct,deleteProduct,editProduct,fetchAllProduct}=require("../../controllers/admin/product-controller");
const {upload}= require("../../helpers/cloudinary");
const authMiddleware = require("../../utils/authMiddleware");


Routes.post("/upload-product-image",upload.single("my_filez"),handleImageUpload)
Routes.post("/addproduct",authMiddleware,addProduct);
Routes.put("/editproduct/:id",authMiddleware,editProduct);
Routes.delete("/deleteproduct/:id",authMiddleware,deleteProduct);
Routes.get("/getallproduct",fetchAllProduct);



module.exports = Routes;