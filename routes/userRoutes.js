import { Router } from "express";
import { getSingleUser, getUsers } from "../controllers/userController.js";
import { isMyself, rolesPermitted } from "../middlewares/isPermitted.js";

const userRouter = Router();

userRouter.get("/", rolesPermitted("admin"), getUsers);
userRouter.route("/:id").get(isMyself, getSingleUser);

export default userRouter;
