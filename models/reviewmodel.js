import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please provide a title"],
    },
    description: {
      type: String,
      required: [true, "please provide a description"],
    },
    rating: {
      type: Number,
      required: [true, "please provide a rating number"],
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: [true, "please provide a product"],
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please provide a user"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, id: false }
);

reviewSchema.methods.calculateReviews = async function () {
  const productId = this.productId;

  const result = await this.constructor.aggregate([
    {
      $match: {
        productId: productId,
      },
    },
    {
      $group: {
        _id: null,
        numOfReviews: {
          $count: {},
        },
        avgRating: {
          $avg: "$rating",
        },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ]);

  console.log("result:", result);
  const stats = {
    averageRating: Math.round(result[0].avgRating),
    numOfReviews: result[0].numOfReviews,
  };
  console.log(stats);

  await this.model("Product").findOneAndUpdate({ _id: productId }, stats);
};

reviewSchema.pre("save", async function () {
  this.calculateReviews();
});

reviewSchema.post("remove", async function () {
  this.calculateReviews();
});

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
