import { Request, Response } from "express";
import { IBarber } from "../interfaces/IBarber";
import { BarberRepository } from "../repositories/BarberRepository";
import http from "../utils/http";
import {
  validateCreateBarberSchema,
  validateBarberWithoutPhotoUrl
} from "../schemas/BarberSchema";

export class BarberController {
  static async list(req: Request, res: Response): Promise<Response<IBarber[]>> {
    const params = req.query as Partial<IBarber>;

    const { success, data, error } = validateBarberWithoutPhotoUrl(params);
    if (!success || !data) {
      return res.status(400).json({ message: "Invalid params", error });
    }

    const barbers = await BarberRepository.findAll(params);
    return http.ok(res, barbers);
  }

  static async getById(
    req: Request,
    res: Response
  ): Promise<Response<IBarber>> {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const barber = await BarberRepository.findById(id);
    if (!barber) {
      return res.status(404).json({ message: "Barber not found" });
    }

    return http.ok(res, barber);
  }

  static async create(req: Request, res: Response): Promise<Response<IBarber>> {
    const body = req.body as IBarber;

    const { success, data, error } = validateCreateBarberSchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    // Função para fazer upload da 'image' com multer
    const imagePath = req.file?.filename as string;
    if (imagePath) {
      data.photoUrl = imagePath;
    } else {
      return http.badRequest(res, "Image is required");
    }

    const barber = await BarberRepository.create(data);
    return http.created(res, "Barber created", barber);
  }

  static async update(req: Request, res: Response): Promise<Response<IBarber>> {
    const data = req.body as IBarber;

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const barberExists = await BarberRepository.findById(id);
    if (!barberExists) {
      return http.notFound(res, "Barber not found");
    }

    // Função para fazer upload da 'image' com multer
    const imagePath = req.file?.filename as string;
    if (imagePath) {
      data.photoUrl = imagePath;
    }

    const updatedBarber = {
      ...barberExists,
      name: data.name,
      age: data.age,
      photoUrl: data.photoUrl,
      specialties: data.specialties,
      updatedAt: new Date()
    };

    const barber = await BarberRepository.update(updatedBarber);
    return http.ok(res, "Barber updated", barber);
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const barberExists = await BarberRepository.findById(id);
    if (!barberExists) {
      return http.notFound(res, "Barber not found");
    }

    await BarberRepository.delete(id);
    return http.ok(res, "Barber deleted");
  }
}
