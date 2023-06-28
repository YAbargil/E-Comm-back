import { Router } from "express";
import {
  addProduct,
  getProducts,
  getSingleProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { isProductExists } from "../middlewares/isExists.js";
import { rolesPermitted } from "../middlewares/isPermitted.js";
import { isAuthorized } from "../utils/auth.js";

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.post("/add", addProduct);
productRouter
  .route("/:id")
  .get(isProductExists, getSingleProduct)
  .delete(isAuthorized, rolesPermitted("admin"), isProductExists, deleteProduct)
  .patch(isAuthorized, rolesPermitted("admin"), isProductExists, updateProduct);

export default productRouter;
