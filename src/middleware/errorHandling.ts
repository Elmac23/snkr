import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/Errors/APIError.js";

export async function errorHandling(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(err.message);

  const { statusCode } = err as APIError;
  return res
    .status(statusCode || StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ data: err.message });
}
