import { Request, Response } from "express";

export class AppointmentController {
  static async list(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }

  static async getById(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }

  static async create(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }

  static async update(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }
}
