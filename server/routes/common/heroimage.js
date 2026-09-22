const express= require("express");
const { AddHeroImageInHomePage, getHeroImages, deleteHeroImages } = require("../../controllers/admin/heroImage-controller");
const authMiddleware = require("../../utils/authMiddleware");
const Routes = express.Router();





// Reading hero images is public: the storefront home page renders them for
// guests too. Creating them stays admin-only.
Routes.post("/",authMiddleware,authMiddleware.authorizePermissions("admin"),AddHeroImageInHomePage)
Routes.get("/",getHeroImages)
Routes.delete("/:id",authMiddleware,authMiddleware.authorizePermissions("admin"),deleteHeroImages)

module.exports = Routes