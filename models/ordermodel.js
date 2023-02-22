import mongoose from "mongoose";
import { Product } from "./productmodel.js";

const orderItemSchema = mongoose.Schema(
  {
    itemName: {
      type: String,
      required: [true, "please provide a value for buyer name"],
    },
    quantity: {
      type: Number,
      required: [true, "please provide a value for item quantity"],
    },
    itemPrice: {
      type: Number,
      required: [true, "please provide a value for item quantity"],
    },
    image: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { toJSON: { virtuals: true }, id: false }
);
const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    total: {
      type: Number,
      required: [true, "please provide a value for total amount"],
    },
    payment: {
      type: String,
      enum: ["card", "cash"],
      default: "card",
    },
    items: [],
    status: {
      type: String,
      enum: ["paid", "on delivery", "completed"],
      default: "paid",
    },
  },
  { timestamps: true }
);

orderItemSchema.virtual("total").get(function () {
  return this.quantity * this.itemPrice;
});

//also decrease product's stock .
orderSchema.pre("save", async function () {
  const count = await OrderItem.countDocuments({ userId: this.userId });
  if (count === 0) {
    return;
  }
  const orderItems = await OrderItem.find({ userId: this.userId });
  for (let i = 0; i < orderItems.length; i++) {
    const { productId, quantity } = orderItems[i];
    await Product.findOneAndUpdate(
      { _id: productId },
      { $inc: { stock: -quantity } }
    );
  }
  await OrderItem.deleteMany({ userId: this.userId });
});

export const Order = mongoose.model("Order", orderSchema);
export const OrderItem = mongoose.model("OrderItem", orderItemSchema);
