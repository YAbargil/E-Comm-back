import { User } from "../models/usermodel.js";
import { CustomError } from "../errors/totalErrors.js";
import { createToken } from "../utils/auth.js";
import { StatusCodes } from "http-status-codes";
import * as bcrpyt from "bcrypt";

export const signUp = async (req, res) => {
  const { email, name, password } = req.body;
  const isEmailExists = await User.findOne({ email });
  try {
    if (isEmailExists) {
      throw new CustomError.badRequest("Email already exists");
    }
    const user = await new User({ email, name, password });
    console.log(user);
    const token = createToken(user);
    await user.save();
    res.status(StatusCodes.CREATED).send({ user: { email, name }, token });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new CustomError.badRequest("Please fill values");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.notFound("Invalid credentials");
    }
    const isMatched = await bcrpyt.compare(password, user.password);
    if (!isMatched) {
      throw new CustomError.badRequest("Invalid credentials");
    }
    const token = createToken(user);
    res.status(StatusCodes.OK).send({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};
