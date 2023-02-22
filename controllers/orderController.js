import { Order } from "../models/ordermodel.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/totalErrors.js";
import { calculateTotalOrderItems } from "./orderItemController.js";

export const createOrder = async (req, res) => {
  try {
    const result = await calculateTotalOrderItems(res.user._id);
    if (result.length === 0) {
      throw new CustomError.badRequest("Order Items were not found");
    }
    const orderItems = result.orderItems.map((o) => ({
      itemName: o.itemName,
      image: o.image,
      itemPrice: o.itemPrice,
      quantity: o.quantity,
      productId: o.productId,
    }));
    const order = new Order({
      userId: result.orderItems[0].userId,
      total: result.total,
      items: orderItems,
    });
    await order.save();
    res.status(StatusCodes.CREATED).send({ order });
  } catch (err) {
    console.log(err);
    if (err.statusCode) {
      res.status(err.statusCode).send({ msg: err.message });
    } else {
      res.status(400).send({ msg: err.message });
    }
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: res.user._id });
    if (orders.length == 0) {
      throw new CustomError.notFound(
        `No orders were made for ${res.user._id} `
      );
    }
    res.status(StatusCodes.OK).send({ orders });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id });
    if (!order) {
      throw CustomError.notFound("No such order exists");
    }
    const { status } = req.body;
    if (status === order.status) {
      throw CustomError.badRequest("Cant change to same value");
    }
    const updatedOrder = await Order.findOneAndUpdate(
      { _id: req.params.id },
      { status },
      { new: true }
    );
    await updatedOrder.validate();
    res.status(StatusCodes.CREATED).send({ order: updatedOrder });
  } catch (err) {
    if (err.StatusCodes) {
      res.status(err.statusCode).send({ msg: err.message });
    } else {
      res.status(StatusCodes.BAD_REQUEST).send({ msg: err.message });
    }
  }
};
