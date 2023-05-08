import { APIError } from "./APIError";

export class BadRequestError extends APIError {
  constructor(message: string) {
    super(message, 400);
  }
}
