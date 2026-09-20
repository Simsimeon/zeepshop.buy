const express = require("express");
const searchProduct = require("../../controllers/shop/search-controller");
const Routes=express.Router();


Routes.get("/",searchProduct)



module.exports=Routes