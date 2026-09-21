const express = require("express");
const Routes = express.Router();
const {handleImageUpload,addProduct,deleteProduct,editProduct,fetchAllProduct}=require("../../controllers/admin/product-controller");
const {upload}= require("../../helpers/cloudinary");
const authMiddleware = require("../../utils/authMiddleware");


Routes.post("/upload-product-image",authMiddleware,authMiddleware.authorizePermissions("admin"),upload.single("my_filez"),handleImageUpload)
Routes.post("/addproduct",authMiddleware,authMiddleware.authorizePermissions("admin"),addProduct);
Routes.put("/editproduct/:id",authMiddleware,authMiddleware.authorizePermissions("admin"),editProduct);
Routes.delete("/deleteproduct/:id",authMiddleware,authMiddleware.authorizePermissions("admin"),deleteProduct);
Routes.get("/getallproduct",fetchAllProduct);



module.exports = Routes;