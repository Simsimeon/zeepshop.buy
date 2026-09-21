const { StatusCodes } = require("http-status-codes")
const HeroImage = require("../../model/HeroImage")
const { validateImageInput } = require("../../utils/validateImage")



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

module.exports = { AddHeroImageInHomePage, getHeroImages }