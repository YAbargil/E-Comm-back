import { customizedError } from "./customizedError.js";
import { StatusCodes } from "http-status-codes";

export class unAuthorized extends customizedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}
