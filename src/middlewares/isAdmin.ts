import { Request, Response, NextFunction } from "express";

export function isAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({
      error: "Acesso negado. Apenas administradores podem realizar essa ação.",
    });
  }

  return next();
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        role: string;
      };
    }
  }
}
