import { Request, Response, NextFunction } from "express";
import http from "../utils/http";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  const role = req.userRole;

  if (!role || role !== "ADMIN") {
    return http.forbidden(res, "Admin access only");
  }

  return next();
}
