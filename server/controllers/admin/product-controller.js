const { StatusCodes } = require("http-status-codes");
const { imageUploadUtils } = require("../../helpers/cloudinary");
const productModel = require("../../model/product.model");
const { BadRequestError } = require("../../errors");

async function handleImageUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: "Please upload an image file.",
      });
    }

    const base64 = req.file.buffer.toString("base64");
    const dataUrl = `data:${req.file.mimetype};base64,${base64}`;
    const result = await imageUploadUtils(dataUrl);


    return res.status(StatusCodes.OK).json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error occurred while uploading the image.",
    });
  }
}
async function addProduct(req, res) {
  try {
    const productBody = req.body || {};
    const userId = req.user?.userInfo?.userId || req.user?._id || productBody.user;

    const productItem = await productModel.create({
      image: productBody.image,
      title: productBody.title,
      description: productBody.description,
      category: productBody.category,
      Brand: productBody.brand || productBody.Brand,
      price: Number(productBody.price || 0),
      salePrice: productBody.salePrice ? Number(productBody.salePrice) : undefined,
      totalStock: productBody.totalStock ?? productBody.total,
      user: userId,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: productItem,
    });
  } catch (error) {
    console.log(error.message, "error occurred");

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Error occurred while creating product",
    });
  }
}

async function fetchAllProduct (req,res){
  try{
    const getAllProduct = await productModel.find({});
    res.status(StatusCodes.OK).json({
     data:getAllProduct
    })
  }catch(error){
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Error occurred "
    })
  }

  }
async function editProduct(req,res){
  const {editProductId}=req.params
  try{
   const updatedProduct = await productModel.findOneAndUpdate(
    {_id:editProductId},
    req.body,
    {
       new:true,
      runValidators:true,
    }
   ) 
   if(!updatedProduct){
    throw new BadRequestError(`No product with that id ${id}`)
   }
 res.status(StatusCodes.OK).json({
  success:true,
  data:updatedProduct
 })

  }catch(error){
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Error occurred "
    })
  }
}
async function deleteProduct (){
  const {productId}=req.params
  try{
  const deletedProduct = await productModel.findOne({_id:productId});
    await deletedProduct.remove()
    res.status(StatusCodes.OK).json({
      message:'Product deleted successfully',
      success:true,
    })
  }catch(error){
     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"Error occurred "
    })
  }
} 
module.exports = { handleImageUpload, addProduct,deleteProduct,editProduct,fetchAllProduct };