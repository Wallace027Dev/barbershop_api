import { NextFunction, Request, Response } from "express";

export const errorHandler =
  (log = console.error) =>
  (err: any, req: Request, res: Response, next: NextFunction) => {
    log(err);
    res.status(500).json({ message: err.message || "Internal Server Error" });
  };
