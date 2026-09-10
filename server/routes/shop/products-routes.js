const express = require("express");
const { getFilteredProducts,getProductDetails } = require("../../controllers/shop/projects-controller");
const Routes = express.Router();


Routes.get("/get",getFilteredProducts);
Routes.get("/get/:id",getProductDetails);

module.exports=Routes