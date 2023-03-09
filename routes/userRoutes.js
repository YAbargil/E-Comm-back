import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { getSingleUser, getUsers } from "../controllers/userController.js";
import { isMyself, rolesPermitted } from "../middlewares/isPermitted.js";

const userRouter = Router();

userRouter.get("/", rolesPermitted("admin"), getUsers);
userRouter.get("/isauth", (req, res) => {
  console.log(res.user);
  res
    .status(StatusCodes.OK)
    .send({ name: res.user.name, email: res.user.email });
});
userRouter.route("/:id").get(isMyself, getSingleUser);

export default userRouter;
