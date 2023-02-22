import { Router } from "express";
import {
  createOrderItem,
  deleteOrderItem,
  updateOrderItem,
  getSingleOrderItem,
  getOrderItems,
} from "../controllers/orderItemController.js";
import { isOrderItemExists } from "../middlewares/isExists.js";
import { isMyself } from "../middlewares/isPermitted.js";

const orderitemRoutes = Router();

orderitemRoutes.get("/", getOrderItems);
orderitemRoutes.post("/add", createOrderItem);
orderitemRoutes
  .route("/:id")
  .all(isOrderItemExists, isMyself)
  .get(getSingleOrderItem)
  .patch(updateOrderItem)
  .delete(deleteOrderItem);

export default orderitemRoutes;
