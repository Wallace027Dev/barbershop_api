import { Request, Response } from "express";
import { ISpecialty, ISpecialtyBase } from "../interfaces/ISpecialty";
import {
  validateCreateSpecialtySchema,
  validateSpecialtyWithoutIconUrl
} from "../schemas/SpecialtySchema";
import { SpecialtyRepository } from "../repositories/SpecialtyRepository";
import http from "../utils/http";

export class SpecialtyController {
  static async list(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty[]>> {
    const params = req.query as Partial<ISpecialtyBase>;

    const { success, data, error } = validateSpecialtyWithoutIconUrl(params);
    if (!success || !data) {
      return res.status(400).json({ message: "Invalid params", error });
    }

    const specialties = await SpecialtyRepository.findAll(data.name);
    if (specialties.length === 0) {
      return res.status(404).json({ message: "Specialties not found" });
    }

    return http.ok(res, specialties);
  }

  static async getById(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const specialty = await SpecialtyRepository.findById(id);
    if (!specialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }

    return http.ok(res, specialty);
  }

  static async create(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const body = req.body as ISpecialtyBase;
    const { success, data, error } = validateCreateSpecialtySchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    const specialtyExists = await SpecialtyRepository.findById(data.name);
    if (specialtyExists) {
      return http.conflict(res, "Specialty already exists");
    }

    // Função para fazer upload do 'icon' com multer
    const imagePath = req.file?.filename as string;
    if (imagePath) {
      data.iconUrl = imagePath;
    } else {
      return http.badRequest(res, "Icon is required");
    }

    const specialty = await SpecialtyRepository.create(data);
    return http.created(res, "Specialty created", specialty);
  }

  static async update(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }

  static async delete(req: Request, res: Response) {
    res.status(405).json({ message: "Method not allowed" });
  }
}
