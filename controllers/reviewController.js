import { Review } from "../models/reviewmodel.js";
import { Product } from "../models/productmodel.js";
import { CustomError } from "../errors/totalErrors.js";
import { StatusCodes } from "http-status-codes";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: res.user._id });
    // .populate({
    //   path: "productId",
    //   select: "title",
    // })
    // .exec();

    if (reviews.length === 0) {
      throw new CustomError.notFound("No reviews found.");
    }
    res.status(StatusCodes.OK).send({ reviews });
  } catch (err) {
    if (err.StatusCodes) {
      res.status(err.statusCode).send({ msg: err.message });
    } else {
      res.status(400).send({ msg: err.message });
    }
  }
};
export const addReview = async (req, res) => {
  try {
    const { title, description, rating, productId } = req.body;
    const product = await Product.findOne({ _id: productId });
    if (!product) {
      throw new CustomError.badRequest("Product was not found");
    }
    if (!title || !description || !rating) {
      throw new CustomError.badRequest("Please fill the values");
    }
    const review = new Review({
      title,
      description,
      rating,
      productId,
      userId: res.user._id,
    });
    await review.save();
    res.status(StatusCodes.OK).send({ review });
  } catch (err) {
    if (err.StatusCodes) {
      res.status(err.statusCode).send({ msg: err.message });
    } else {
      res.status(400).send({ msg: err.message });
    }
  }
};

export const getReview = async (req, res) => {
  const review = await res.review.populate({
    path: "userId",
    select: "name",
  });
  res.status(StatusCodes.OK).send({ review });
};

export const deleteReview = async (req, res) => {
  try {
    const review = res.review;
    await review.remove();
    res.status(StatusCodes.OK).send({ msg: "removed" });
  } catch (err) {
    console.log("Couldn't delete the review", err);
    res.status(StatusCodes.BAD_GATEWAY).send({ msg: err.message });
  }
};
