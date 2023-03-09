import { OrderItem } from "../models/ordermodel.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/totalErrors.js";
import { Product } from "../models/productmodel.js";

export const createOrderItem = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      throw new CustomError.notFound("Product was not found");
    }
    quantity = quantity > product.stock ? product.stock : quantity;
    let orderItem;
    orderItem = await OrderItem.findOne({
      productId: product._id,
      userId: res.user._id,
    });
    if (!orderItem) {
      orderItem = new OrderItem({
        itemName: product.title,
        itemBrand: product.brand,
        quantity,
        itemPrice: product.price,
        image: product.images[0],
        productId: product._id,
        userId: res.user._id,
      });
    } else {
      orderItem.quantity = quantity;
    }
    await orderItem.save();
    res.status(StatusCodes.CREATED).send({ orderItem });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const deleteOrderItem = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("ProductId:", productId);
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      throw new CustomError.notFound("Product was not found");
    }
    const orderItem = await OrderItem.findOne({
      userId: res.user._id,
      productId: product._id,
    });
    if (!orderItem) {
      throw new CustomError.notFound("OrderItem was not found");
    }
    await orderItem.remove();
    res
      .status(StatusCodes.ACCEPTED)
      .send({ orderItem, msg: "Order item was removed" });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const updateOrderItem = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      throw new CustomError.notFound("Product was not found");
    }
    quantity = quantity > product.stock ? product.stock : quantity;
    const orderItem = await OrderItem.findOne({
      userId: res.user._id,
      productId: product._id,
    });
    if (!orderItem) {
      throw new CustomError.notFound("OrderItem was not found");
    }
    orderItem.quantity = quantity;
    await orderItem.save();
    res.status(StatusCodes.ACCEPTED).send({ orderItem });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const getSingleOrderItem = async (req, res) => {
  const orderItem = res.orderItem;
  res.status(StatusCodes.OK).send({ orderItem });
};

export const calculateTotalOrderItems = async function (userId) {
  const orderItems = await OrderItem.find({ userId });
  let total = 0;
  orderItems.forEach((item) => {
    total += item.total;
  });
  return { orderItems, length: orderItems.length, total };
};

export const getOrderItems = async (req, res) => {
  const items = await calculateTotalOrderItems(res.user._id);
  res.status(StatusCodes.OK).send({ items });
};
