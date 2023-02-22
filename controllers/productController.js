import { Product } from "../models/productmodel.js";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "../errors/totalErrors.js";

export const getProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).send({ products, length: products.length });
};

export const addProduct = async (req, res) => {
  try {
    const { title, description, price, images, brand, category, stock } =
      req.body;
    const isTaken = await Product.findOne({ title });
    if (isTaken) {
      throw new CustomError.badRequest("Product already exists");
    }
    const product = new Product({
      title,
      description,
      price,
      images,
      brand,
      category,
      stock,
    });
    await product.save();
    res.status(StatusCodes.CREATED).send({ product });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const getSingleProduct = async (req, res) => {
  const product = await res.product.populate("reviews");
  res.status(StatusCodes.OK).send({ product });
};

export const deleteProduct = async (req, res) => {
  try {
    const product = res.product;
    await product.remove();
    res.status(StatusCodes.OK).send({ product, msg: "Deleted" });
  } catch (err) {
    res
      .status(StatusCodes.BAD_GATEWAY)
      .send({ msg: "Couldn't delete product" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { price, stock } = req.body;
    const product = res.product;
    if (price === product.price && stock === product.stock) {
      CustomError.badRequest("No values to change");
    }
    product.price = price === undefined ? product.price : price;
    product.stock = stock === undefined ? product.stock : stock;
    await product.save();

    res.status(StatusCodes.CREATED).send({ product });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};
