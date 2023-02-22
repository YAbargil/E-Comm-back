import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide a title"],
      unique: true,
    },
    description: {
      type: String,
      required: [true, "please provide a description"],
    },
    price: {
      type: Number,
      default: 0,
    },
    images: {
      type: [],
      default: "/public/default.jpeg",
    },
    brand: {
      type: String,
      required: [true, "please provide a brand"],
    },
    stock: {
      type: Number,
      default: 15,
    },
    averageRating: {
      type: Number,
    },
    numOfReviews: {
      type: Number,
    },
  },
  { toJSON: { virtuals: true }, id: false }
);

// populating virtuals
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "productId",
});

export const Product = mongoose.model("Product", productSchema);
