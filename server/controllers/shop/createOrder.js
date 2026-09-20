const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../../errors");
const AddressModel = require("../../model/Address.model");
const Cart = require("../../model/Cart");
const OrderModel = require("../../model/Order.model");
const { payment, verifyPayment } = require("../../utils/paystack");
const productModel = require("../../model/product.model");
const mongoose = require("mongoose");

function getAuthenticatedUserId(req) {
  return req.user?.userInfo?.userId || req.user?.userId || req.user?._id;
}

function isAdmin(req) {
  return req.user?.userInfo?.role === "admin" || req.user?.role === "admin";
}

async function reduceOrderStock(order, session) {
  for (const item of order.cartItem) {
    const quantity = Number(item.quantity);

    if (!item.productId || !Number.isInteger(quantity) || quantity < 1) {
      throw new BadRequestError("Invalid product quantity in order");
    }

    const product = await productModel.findOneAndUpdate(
      { _id: item.productId, totalStock: { $gte: quantity } },
      { $inc: { totalStock: -quantity } },
      { new: true, session },
    );

    if (!product) {
      throw new BadRequestError(`Insufficient stock for product ${item.productId}`);
    }
  }
}

async function verifyOrderPayment(req, res) {
  const { reference } = req.query;

  if (!reference) {
    throw new BadRequestError("Payment reference is required");
  }

  const verification = await verifyPayment(reference);

  const order = await OrderModel.findOne({ paymentId: reference });

  if (!order) {
    throw new NotFoundError("Order not found for this payment reference");
  }

  if (verification?.data?.status === "success") {
    const session = await mongoose.startSession();

    try {
      await session.withTransaction(async () => {
        const currentOrder = await OrderModel.findById(order._id).session(session);

        if (currentOrder.orderStatus !== "confirmed") {
          await reduceOrderStock(currentOrder, session);
        }

        currentOrder.paymentStatus = "paid";
        currentOrder.orderStatus = "confirmed";
        currentOrder.paymentId = reference;
        currentOrder.orderUpdateDate = new Date();
        await currentOrder.save({ session });
        order.set(currentOrder.toObject());
      });
    } finally {
      await session.endSession();
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Payment verified successfully",
      data: order,
    });
  }

  order.paymentStatus = "failed";
  order.orderStatus = "failed";
  order.orderUpdateDate = new Date();
  await order.save();

  return res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: "Payment verification failed",
    data: verification,
  });
}

async function createOrder(req, res) {
  const userId = getAuthenticatedUserId(req);
  const {
    addressId,
    paymentMethod = "paystack",
    callback_url,
    email,
  } = req.body;

  if (!userId) {
    throw new BadRequestError("Invalid credentials");
  }

  if (!addressId) {
    throw new BadRequestError("Address is required");
  }

  const cart = await Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "title price salePrice image",
  });

  if (!cart || cart.items.length === 0) {
    throw new BadRequestError("Your cart is empty");
  }

  const address = await AddressModel.findOne({ _id: addressId, userId });
  if (!address) {
    throw new NotFoundError("Address not found");
  }

  const userEmail = email || req.user?.email || req.user?.userInfo?.email;
  if (!userEmail) {
    throw new BadRequestError("Email is required for payment");
  }

  const cartItems = cart.items.map((item) => {
    const product = item.productId;
    if (!product) {
      throw new NotFoundError("One or more products in your cart are no longer available");
    }

    const price = Number(product.salePrice ?? product.price ?? 0);
    return {
      productId: product._id,
      title: product.title,
      price,
      image: product.image,
      salePrice: product.salePrice ?? product.price,
      quantity: item.quantity,
    };
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  let paymentResponse = null;
  if (paymentMethod === "paystack") {
    if (!callback_url) {
      throw new BadRequestError("Callback URL is required for Paystack payment");
    }

    paymentResponse = await payment({
      email: userEmail,
      amount: totalAmount * 100,
      callback_url,
    });
  }

  const order = await OrderModel.create({
    userId,
    cartItem: cartItems,
    addressInfo: {
      addressId: address._id,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      phone: address.phone,
      note: address.note,
    },
    orderStatus: "pending",
    paymentMethod,
    paymentStatus: "pending",
    totalAmount,
    orderDate: new Date(),
    orderUpdateDate: new Date(),
    paymentId: paymentResponse?.data?.reference || null,
    payerId: null,
  });

  await Cart.findOneAndUpdate({ userId }, { items: [] });

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: {
      order,
      payment: paymentResponse?.data || null,
    },
  });
}

async function getUserOrders(req, res) {
  const userId = getAuthenticatedUserId(req);
  const requestedUserId = req.params.userId;

  if (!userId || String(userId) !== String(requestedUserId)) {
    throw new BadRequestError("Invalid credentials");
  }

  const orders = await OrderModel.find({ userId }).sort({ orderDate: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: orders,
  });
}

async function getAllOrders(req, res) {
  if (!isAdmin(req)) {
    throw new BadRequestError("Admin access required");
  }

  const orders = await OrderModel.find().sort({ orderDate: -1 });

  res.status(StatusCodes.OK).json({
    success: true,
    data: orders,
  });
}

async function updateOrderStatus(req, res) {
  if (!isAdmin(req)) {
    throw new BadRequestError("Admin access required");
  }

  const { status } = req.body;
  const allowedStatuses = [
    "pending",
    "process",
    "confirmed",
    "inShipping",
    "delivered",
    "rejected",
  ];

  if (!allowedStatuses.includes(status)) {
    throw new BadRequestError("Invalid order status");
  }

  const session = await mongoose.startSession();
  let updatedOrder;

  try {
    await session.withTransaction(async () => {
      const order = await OrderModel.findById(req.params.id).session(session);

      if (!order) {
        throw new NotFoundError("Order not found");
      }

      const shouldReduceStock = status === "confirmed" && order.orderStatus !== "confirmed";

      if (shouldReduceStock) {
        await reduceOrderStock(order, session);
      }

      order.orderStatus = status;
      order.orderUpdateDate = new Date();
      await order.save({ session });
      updatedOrder = order;
    });
  } finally {
    await session.endSession();
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: updatedOrder,
  });
}

module.exports = {
  createOrder,
  verifyOrderPayment,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};