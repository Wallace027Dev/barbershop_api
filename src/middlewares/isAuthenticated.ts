import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import http from "../utils/http";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userEmail?: string;
    }
  }
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return http.unauthorized(res, "Token is required");
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return http.unauthorized(res, "Token malformatted");
  }

  const token = parts[1];

  try {
    const payload = verify(token, process.env.JWT_SECRET as string) as {
      id: number;
      email: string;
    };

    req.userId = payload.id;
    req.userEmail = payload.email;

    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return http.unauthorized(res, "Token expired");
    }
    return http.unauthorized(res, "Token unauthorized");
  }
}