import { Product } from "../models/productmodel.js";
import { CustomError } from "../errors/totalErrors.js";
import { Review } from "../models/reviewmodel.js";
import { OrderItem, Order } from "../models/ordermodel.js";

export const isProductExists = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      throw new CustomError.notFound("Product was not found");
    }
    res.product = product;
    next();
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};
export const isReviewExists = async (req, res, next) => {
  try {
    const review = await Review.findOne({ _id: req.params.id });
    if (!review) {
      throw new CustomError.notFound("Review was not found");
    }
    res.review = review;
    next();
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const isOrderItemExists = async (req, res, next) => {
  try {
    const orderItem = await OrderItem.findOne({ _id: req.params.id });
    if (!orderItem) {
      throw new CustomError.notFound("OrderItem was not found");
    }
    res.orderItem = orderItem;
    console.log(orderItem);
    next();
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};
