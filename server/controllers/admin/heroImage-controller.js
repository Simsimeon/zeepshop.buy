const mongoose = require("mongoose")
const { StatusCodes } = require("http-status-codes")
const HeroImage = require("../../model/HeroImage")
const { validateImageInput } = require("../../utils/validateImage")
const { BadRequestError, NotFoundError } = require("../../errors")



async function AddHeroImageInHomePage(req, res){
  const {image} = req.body || {}

  const validatedImage = await validateImageInput(image)

  const heroImage = await HeroImage.create({image: validatedImage.image})
  res.status(StatusCodes.CREATED).json({
    success:true,
    data:heroImage
  })
}
async function getHeroImages(req,res){
    const heroImages = await HeroImage.find({});
    res.status(StatusCodes.OK).json({
    success:true,
    data:heroImages
  })
}
async function deleteHeroImages(req,res){
  const { id: heroImageId } = req.params

  if (!mongoose.isValidObjectId(heroImageId)) {
    throw new BadRequestError("Invalid hero image id")
  }

  const heroImage = await HeroImage.findByIdAndDelete(heroImageId)

  if (!heroImage) {
    throw new NotFoundError("Hero image not found")
  }

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Hero image deleted successfully",
    data: heroImage
  })
}

module.exports = { AddHeroImageInHomePage, getHeroImages,deleteHeroImages }