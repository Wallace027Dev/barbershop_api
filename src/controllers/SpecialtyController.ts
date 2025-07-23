import http from "../utils/http";
import "dotenv/config";
import { Request, Response } from "express";
import { ISpecialty, ISpecialtyBase } from "../interfaces/ISpecialty";
import { SpecialtyRepository } from "../repositories/SpecialtyRepository";
import {
  validateCreateSpecialtySchema,
  validateSpecialtyWithoutIconUrl,
  validateUpdateSpecialtySchema,
} from "../schemas/SpecialtySchema";
import { deleteImageFile } from "../helpers/deleteImageFile";

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
    const body = req.body as ISpecialtyBase;
    if (!filename) {
      return http.badRequest(res, "Icon is required");
    }

    const specialtyAlreadyExists = await SpecialtyRepository.findAll(body.name);
    if (specialtyAlreadyExists.length > 0) {
      if (filename) deleteImageFile(filename);
      return http.conflict(res, "Specialty already exists");
    }

    const { success, data, error } = validateCreateSpecialtySchema({
      ...body,
      iconUrl: filename,
    });
    if (!success || !data) {
      if (filename) deleteImageFile(filename);
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
    const body = req.body;
    const filename = req.file?.filename;
    console.log(filename);

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id is required" });
    }

    const specialtyExists = await SpecialtyRepository.findById(id);
    if (!specialtyExists) {
      return http.notFound(res, "Specialty not found");
    }

    const updateSpecialty = {
      ...specialtyExists,
      name: body?.name ?? specialtyExists.name,
      iconUrl: filename ?? specialtyExists.iconUrl,
      updatedAt: new Date(),
    };

    const { success, data, error } = validateUpdateSpecialtySchema(updateSpecialty);
    if (!success || !data) {
      if (filename) deleteImageFile(filename);
      return http.badRequest(res, "Invalid data", error);
    }

    deleteImageFile(specialtyExists.iconUrl);

    const specialty = await SpecialtyRepository.update(updateSpecialty);
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
