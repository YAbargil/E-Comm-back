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

const productRouter = Router();

productRouter.get("/", getProducts);
productRouter.post("/add", addProduct);
productRouter
  .route("/:id")
  .get(isProductExists, getSingleProduct)
  .delete(rolesPermitted("admin"), isProductExists, deleteProduct)
  .patch(rolesPermitted("admin"), isProductExists, updateProduct);

export default productRouter;
