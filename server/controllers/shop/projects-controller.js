const { StatusCodes } = require("http-status-codes");
const productModel = require("../../model/product.model");
const { NotFoundError } = require("../../errors");

const getFilteredProducts= async(req,res)=>{
    try{
         const {category, brand, sortBy = "price-lowtohigh"} = req.query
            const categories = Array.isArray(category) ? category : category ? [category] : [];
            const brands = Array.isArray(brand) ? brand : brand ? [brand] : [];
      let filters = {};
    

            if(categories.length > 0){
                filters.category={$in:categories.flatMap((value) => value.split(","))}
      }
            if(brands.length > 0){
                filters.Brand={$in:brands.flatMap((value) => value.split(","))}
      }
      let sort = {};

      switch(sortBy){
        case "price-lowtohigh":
            sort.price = 1
            break;
     
        case "price-hightolow":
            sort.price = -1
            break;
        case "title-atoz":
            sort.title = 1
            break;
        case "title-ztoa":
            sort.title = -1
            break;
      default:
        sort.price =1
        break;
      }
      
console.log(filters,"filters");
console.log(sort,"sort");
      
        const products = await productModel.find(filters).sort(sort);
        
res.status(StatusCodes.OK).json({  success:true,
    data:products
})



    }catch(error){
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Some error occurred"
        })
        
    }
}
 async function getProductDetails(req,res){
    
    const {id:productId}= req.params;
    const product= await productModel.findById(productId);
    if(!product){
       throw new NotFoundError("Product not found"); 
    }

   res.status(StatusCodes.OK).json({
    success:true,
    data:product
   })
  
    
      
    
 }

module.exports={getFilteredProducts,getProductDetails}