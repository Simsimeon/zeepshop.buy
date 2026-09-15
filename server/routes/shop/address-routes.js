const express = require("express");
const authMiddleware= require("../../utils/authMiddleware")
const { addAddress,
    deleteAddress,
    editAddress,
    fetchAllAddress}=require("../../controllers/shop/address-controller");


    const Routes = express.Router();


Routes.post('/add',authMiddleware,addAddress);
Routes.get('/get/:userId',authMiddleware,fetchAllAddress);
Routes.put('/update/:userId/:addressId',authMiddleware,editAddress);
Routes.delete('/delete/:userId/:addressId',authMiddleware,deleteAddress);
  

module.exports= Routes