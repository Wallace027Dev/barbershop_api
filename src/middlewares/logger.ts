import { NextFunction, Request, Response } from "express";

export const logRequest =
  (log = console.log) =>
  (req: Request, res: Response, next: NextFunction) => {
    log({
      method: req.method,
      url: req.url,
      headers: req.headers
    });

    next();
  };
