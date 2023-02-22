import { customizedError } from "./customizedError.js";
import { StatusCodes } from "http-status-codes";

export class unAuthenticated extends customizedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}
