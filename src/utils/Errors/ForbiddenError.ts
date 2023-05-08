import { APIError } from "./APIError";

export class ForbiddenError extends APIError {
  constructor(message: string) {
    super(message, 403);
  }
}
