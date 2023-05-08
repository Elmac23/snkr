import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/Errors/APIError.js";

export async function notFound(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { protocol, hostname, url } = req;
  const message = `No endpoint found for URL: ${protocol}://${hostname}${url}`;
  throw new APIError(message, StatusCodes.NOT_FOUND);
}
