import { StatusCodes } from "http-status-codes";
import { User } from "../models/usermodel.js";
import { CustomError } from "../errors/totalErrors.js";

export const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ _id: id }).select("-password");
    if (!user) {
      throw new CustomError.notFound("User not found");
    }
    res.status(StatusCodes.OK).send({ user });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const getUsers = async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(StatusCodes.OK).send({ users });
};
