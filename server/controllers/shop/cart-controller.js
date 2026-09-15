const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../../errors");
const Cart = require("../../model/Cart");
const productModel = require("../../model/product.model");

function getAuthenticatedUserId(req) {
  return req.user?.userInfo?.userId || req.user?.userId || req.user?._id;
}

function formatCartItems(items) {
  return items.map((item) => {
    const product = item.productId;
    return {
      productId: product?._id || null,
      image: product?.image || null,
      title: product?.title || "Product not found",
      price: product?.price ?? null,
      salePrice: product?.salePrice ?? null,
      quantity: item.quantity,
    };
  });
}

async function addToCart(req, res) {
  const { productId, quantity } = req.body;
  const userId = getAuthenticatedUserId(req);
  if (!userId || !productId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    throw new BadRequestError("Invalid product or quantity");
  }

  const product = await productModel.findById(productId);
  if (!product) throw new NotFoundError("Product not found");

  const itemQuantity = Number(quantity);
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = new Cart({ userId, items: [] });

  const currentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (currentProductIndex === -1) {
    cart.items.push({ productId, quantity: itemQuantity });
  } else {
    cart.items[currentProductIndex].quantity += itemQuantity;
  }

  await cart.save();
  return res.status(StatusCodes.OK).json({ success: true, data: cart });
}

async function fetchCartItem(req, res) {
  const userId = getAuthenticatedUserId(req);
  if (!userId) throw new BadRequestError("Invalid credentials");

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "image title price salePrice",
  });
  if (!cart) throw new NotFoundError("Cart not found");

  const validItems = cart.items.filter((item) => item.productId);
  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  return res.status(StatusCodes.OK).json({
    success: true,
    data: { ...cart.toObject(), items: formatCartItems(validItems) },
  });
}

async function updateCartItemQuantity(req, res) {
  const { productId, quantity } = req.body;
  const userId = getAuthenticatedUserId(req);
  if (!userId || !productId || !Number.isInteger(Number(quantity)) || Number(quantity) < 1) {
    throw new BadRequestError("Invalid product or quantity");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new NotFoundError("Cart not found");

  const currentProductIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );
  if (currentProductIndex === -1) throw new NotFoundError("Cart item not found");
  cart.items[currentProductIndex].quantity = Number(quantity);
  await cart.save();
  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: { ...cart.toObject(), items: formatCartItems(cart.items) },
  });
}

async function deleteCartItem(req, res) {
  const { productId } = req.params;
  const userId = getAuthenticatedUserId(req);
  if (!userId || !productId) throw new BadRequestError("Invalid credentials");

  const cart = await Cart.findOne({ userId });
  if (!cart) throw new NotFoundError("Cart not found");

  const originalItemCount = cart.items.length;
  cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
  if (cart.items.length === originalItemCount) throw new NotFoundError("Cart item not found");

  await cart.save();
  await cart.populate({
    path: "items.productId",
    select: "image title price salePrice",
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: { ...cart.toObject(), items: formatCartItems(cart.items) },
  });
}

module.exports = { addToCart, updateCartItemQuantity, fetchCartItem, deleteCartItem };
