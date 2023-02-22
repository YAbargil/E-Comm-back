import { customizedError } from "./customizedError.js";
import { StatusCodes } from "http-status-codes";

export class notFound extends customizedError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}
