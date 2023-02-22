import { badRequest } from "./badRequest.js";
import { notFound } from "./notFound.js";
import { unAuthenticated } from "./unAuthenticated.js";
import { unAuthorized } from "./unAuthorized.js";
import { customizedError } from "./customizedError.js";

export const CustomError = {
  badRequest,
  notFound,
  unAuthenticated,
  unAuthorized,
  customizedError,
};
