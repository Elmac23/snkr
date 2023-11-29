import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { APIError } from "../utils/Errors/APIError.js";
import jwt from "jsonwebtoken";
import { config } from "dotenv";
import { ForbiddenError } from "../utils/Errors/ForbiddenError.js";
import { UnauthorizedError } from "../utils/Errors/UnauthorizedError.js";
config();

export async function authorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) throw new UnauthorizedError("Jwt token wasnt provided");
  const result = jwt.verify(token!, process.env.JWT_SECRET!);
  console.log(result);
  next();
}
