import jwt from "jsonwebtoken";
import { CustomError } from "../errors/totalErrors.js";

export const createToken = (user) => {
  const { id: _id, name, email, role } = user;
  const token = jwt.sign(
    {
      _id,
      name,
      email,
      role,
    },
    process.env.SECRET,
    {
      expiresIn: "2h",
    }
  );
  return token;
};

export const isAuthorized = async (req, res, next) => {
  const bearer = req.headers["authorization"] || null;
  try {
    if (!bearer) {
      throw new CustomError.unAuthenticated("No bearer");
    }
    const [, token] = bearer.split(" ");
    if (!token) {
      throw new CustomError.unAuthenticated("No token");
    }
    jwt.verify(token, process.env.SECRET, (err, decoded) => {
      if (err) {
        throw new CustomError.unAuthenticated("Wrong token");
      }
      const { email, _id, name, role } = decoded;
      res.user = { _id, email, name, role };
      next();
    });
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};
