import { CustomError } from "../errors/totalErrors.js";

export const rolesPermitted =
  (...roles) =>
  (req, res, next) => {
    try {
      if (!roles.includes(res.user.role)) {
        throw new CustomError.unAuthorized("Unauthorized to access this route");
      }
      next();
    } catch (err) {
      console.log(err);
      res.status(err.statusCode).send({ msg: err.message });
    }
  };

export const isMyself = async (req, res, next) => {
  try {
    if (res.user.role === "admin") {
      next();
      return;
    }
    if (res.user._id !== req.params.id) {
      throw new CustomError.unAuthorized("Unauthorized to access this route");
    }
    next();
  } catch (err) {
    res.status(err.statusCode).send({ msg: err.message });
  }
};
