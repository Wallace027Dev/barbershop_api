import { Request, Response } from "express";

export class AuthController {
  static async login(req: Request, res: Response) {
      res.status(405).json({ message: "Method not allowed" });
    }

  static async register(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }
}
