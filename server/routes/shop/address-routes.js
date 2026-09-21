const express = require("express");
const authMiddleware= require("../../utils/authMiddleware")
const { addAddress,
    deleteAddress,
    editAddress,
    fetchAllAddress}=require("../../controllers/shop/address-controller");


    const Routes = express.Router();


Routes.post('/add',authMiddleware,authMiddleware.authorizePermissions("user"),addAddress);
Routes.get('/get/:userId',authMiddleware,authMiddleware.authorizePermissions("user"),fetchAllAddress);
Routes.put('/update/:userId/:addressId',authMiddleware,authMiddleware.authorizePermissions("user"),editAddress);
Routes.delete('/delete/:userId/:addressId',authMiddleware,authMiddleware.authorizePermissions("user"),deleteAddress);
  

module.exports= Routes