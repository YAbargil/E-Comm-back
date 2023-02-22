import * as dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import { User } from "../models/usermodel.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASS,
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".html",
    partialsDir: path.resolve("./public/handlebars"),
    defaultLayout: false,
  },
  viewPath: path.resolve("./public/handlebars"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

export const notifyOrder = async (order) => {
  const user = await User.findOne({ _id: order.userId });
  const name = user.name.charAt(0).toUpperCase() + user.name.slice(1);
  let date = new Date(order.createdAt);
  date = date.toDateString();

  const mail_config = {
    from: process.env.USER_EMAIL,
    to: user.email,
    subject: `MyShopy - Order Confirmation `,
    template: "order",
    context: {
      _id: order._id.toString(),
      createdAt: date,
      name: name,
      items: order.items,
      total: order.total,
    },
  };
  //  console.log(mail_config);
  await transporter.sendMail(mail_config, (err, info) => {
    if (err) {
      console.log("Error was made when sending the mail,Error: ", err.message);
    } else {
      console.log(`Email: ${user.email} sent ` + info.accepted + info.response);
    }
  });
};
