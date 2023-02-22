import { customizedError } from "./customizedError.js";
import { StatusCodes } from "http-status-codes";

export class badRequest extends customizedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
