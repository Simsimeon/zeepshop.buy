const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../../errors");
const productModel = require("../../model/product.model");

async function searchProduct(req,res){
    const { keyword, page = 1, limit = 20 } = req.query;

  const cleanKeyword = String(keyword ?? "").trim(); 


  const isOnlyNumbers = /^\d+$/.test(cleanKeyword);

  if (!cleanKeyword || isOnlyNumbers) {
    throw new BadRequestError("Search input must be a text string and cannot be a number.");
  }


  const safeKeyword = cleanKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const reqEx =new RegExp(safeKeyword,"i");
const searchQuery={
    $or:[
        {title:reqEx},
        {description:reqEx},
        {category:reqEx},
        {Brand:reqEx},
    ]
}
 const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  const [searchResults, totalResults] = await Promise.all([
    productModel.find(searchQuery).skip(skip).limit(parsedLimit).lean(),
    productModel.countDocuments(searchQuery)
  ]);

res.status(StatusCodes.OK).json({
    success: true,
    pagination: {
      totalItems: totalResults,
      currentPage: parsedPage,
      totalPages: Math.ceil(totalResults / parsedLimit),
      limit: parsedLimit
    },
    data: searchResults,
  });
}

module.exports = searchProduct;






