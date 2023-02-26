import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import morgan from "morgan";
import { connectDB } from "./connect.js";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { isAuthorized } from "./utils/auth.js";
import productRouter from "./routes/productRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import orderitemRoutes from "./routes/orderItemRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
const app = express();
const port = 3001;
const url = process.env.DB_URL;

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use(express.static("public"));

app.use("/api/auth", authRouter);
app.use("/api/users", isAuthorized, userRouter);
app.use("/api/products", isAuthorized, productRouter);
app.use("/api/reviews", isAuthorized, reviewRouter);
app.use("/api/orderitems", isAuthorized, orderitemRoutes);
app.use("/api/orders", isAuthorized, orderRouter);

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, "localhost", () => {
      console.log("Server up and running at http://localhost:3001");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
