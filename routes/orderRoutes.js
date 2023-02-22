import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { rolesPermitted } from "../middlewares/isPermitted.js";

const orderRouter = Router();

orderRouter.get("/", getOrders);
orderRouter.post("/create", createOrder);
orderRouter.route("/:id").all(rolesPermitted("admin")).patch(updateOrderStatus);

export default orderRouter;
