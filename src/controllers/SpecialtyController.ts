import http from "../utils/http";
import "dotenv/config";
import { Request, Response } from "express";
import { ISpecialty, ISpecialtyBase } from "../interfaces/ISpecialty";
import { SpecialtyRepository } from "../repositories/SpecialtyRepository";
import {
  validateCreateSpecialtySchema,
  validateSpecialtyWithoutIconUrl,
} from "../schemas/SpecialtySchema";

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

    return http.ok(res, "Specialties found", specialties);
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

    return http.ok(res, "Specialty found", specialty);
  }

  static async create(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const filename = req.file?.filename;

    if (!filename) {
      return http.badRequest(res, "Icon is required");
    }

    const iconUrl = `${process.env.BASE_URL}/uploads/${filename}`;
    console.log(iconUrl);

    const body = {
      ...req.body,
      iconUrl,
    };

    const { success, data, error } = validateCreateSpecialtySchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    const specialtyExists = await SpecialtyRepository.findById(data.name);
    if (specialtyExists) {
      return http.conflict(res, "Specialty already exists");
    }

    const specialty = await SpecialtyRepository.create(data);
    return http.created(res, "Specialty created", specialty);
  }

  static async update(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const body = req.body as ISpecialtyBase;

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const specialtyExists = await SpecialtyRepository.findById(id);
    if (!specialtyExists) {
      return http.notFound(res, "Specialty not found");
    }

    const { success, data, error } = validateCreateSpecialtySchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    const updatedSpecialty = {
      ...specialtyExists,
      name: data.name,
      iconUrl: data.iconUrl,
      updatedAt: new Date(),
    };

    const specialty = await SpecialtyRepository.update(updatedSpecialty);
    return http.ok(res, "Specialty updated", specialty);
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const specialtyExists = await SpecialtyRepository.findById(id);
    if (!specialtyExists) {
      return http.notFound(res, "Specialty not found");
    }

    await SpecialtyRepository.delete(id);
    return http.ok(res, "Specialty deleted");
  }
}
