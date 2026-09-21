const express= require("express");
const { AddHeroImageInHomePage, getHeroImages } = require("../../controllers/admin/heroImage-controller");
const authMiddleware = require("../../utils/authMiddleware");
const Routes = express.Router();





Routes.post("/",authMiddleware,authMiddleware.authorizePermissions("admin"),AddHeroImageInHomePage)
Routes.get("/",authMiddleware,authMiddleware.authorizePermissions("admin"),getHeroImages)

module.exports = Routes