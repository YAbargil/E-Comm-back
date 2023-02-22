import { Router } from "express";
import {
  getOrders,
  createOrder,
  updateOrderStatus,
  // sendEmail,
} from "../controllers/orderController.js";
import { rolesPermitted } from "../middlewares/isPermitted.js";

const orderRouter = Router();

orderRouter.get("/", getOrders);
orderRouter.post("/create", createOrder);
orderRouter.route("/:id").all(rolesPermitted("admin")).patch(updateOrderStatus);
// .get(sendEmail);

export default orderRouter;
