import http from "../utils/http";
import { Request, Response } from "express";
import { BarberRepository } from "../repositories/BarberRepository";
import { IBarber } from "../interfaces/IBarber";
import { deleteImageFile } from "../helpers/deleteImageFile";
import {
  validateCreateBarberSchema,
  validateParamsBarber,
  validateUpdateBarberSchema
} from "../schemas/BarberSchema";

export class BarberController {
  static async list(req: Request, res: Response): Promise<Response<IBarber[]>> {
    const params = req.query as Partial<IBarber>;

    const { success, error } = validateParamsBarber(params);
    if (!success) {
      return res.status(400).json({ message: "Invalid params", error });
    }

    const barbers = await BarberRepository.findAll(params);
    if (barbers.length === 0) return http.notFound(res, "Barbers not found");

    return http.ok(res, "Barbers found", barbers);
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
    if (!barber) return res.status(404).json({ message: "Barber not found" });

    return http.ok(res, "Barber found", barber);
  }

  static async create(req: Request, res: Response): Promise<Response<IBarber>> {
    const body = req.body as IBarber;
    const imagePath = req.file?.filename as string;

    const { success, error } = validateCreateBarberSchema(body);
    if (!success) {
      if (imagePath) deleteImageFile(imagePath);
      return http.badRequest(res, "Invalid data", error);
    }

    const barberAlreadyExists = await BarberRepository.findAll({ name: body.name });
    if (barberAlreadyExists.length > 0) {
      if (imagePath) deleteImageFile(imagePath);
      return http.conflict(res, "Barber already exists");
    }

    if (imagePath) {
      body.photoUrl = imagePath;
    } else {
      return http.badRequest(res, "Image is required");
    }

    const barber = await BarberRepository.create(body);
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
    return http.notFound(res,  "Barber not found");
    }

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

    const { success, error } = validateUpdateBarberSchema(updatedBarber);
    if (!success) {
      if (imagePath) deleteImageFile(imagePath);
      return http.badRequest(res, "Invalid data", error);
    }

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
    return http.ok(res, "Barber deleted", { name: barberExists.name });
  }
}
