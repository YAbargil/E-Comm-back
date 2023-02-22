import mongoose from "mongoose";

mongoose.set("strictQuery", true);
export const connectDB = async (url) => {
  mongoose
    .connect(url)
    .then(console.log("Connected to DB"))
    .catch((err) => console.log("Couldnt connect", err));
};
