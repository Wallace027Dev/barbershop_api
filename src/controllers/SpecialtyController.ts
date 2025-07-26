import http from "../utils/http";
import { Request, Response } from "express";
import { ISpecialty, ISpecialtyBase } from "../interfaces/ISpecialty";
import { SpecialtyRepository } from "../repositories/SpecialtyRepository";
import { deleteImageFile } from "../helpers/deleteImageFile";
import {
  validateCreateSpecialtySchema,
  validateParamsSpecialty,
  validateUpdateSpecialtySchema,
} from "../schemas/SpecialtySchema";

export class SpecialtyController {
  static async list(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty[]>> {
    const { name } = req.query as Partial<ISpecialtyBase>;

    const { success, error } = validateParamsSpecialty({ name });
    if (!success) {
      return res.status(400).json({ message: "Parâmetros inválidos", error });
    }

    const specialties = await SpecialtyRepository.findAll(name);
    if (specialties.length === 0) return http.notFound(res, "Nenhuma especialidade encontrada");

    return http.ok(res, "Especialidades encontradas", specialties);
  }

  static async getById(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const specialty = await SpecialtyRepository.findById(id);
    if (!specialty) return res.status(404).json({ message: "Especialidade não encontrada" });

    return http.ok(res, "Especialidade encontrada", specialty);
  }

  static async create(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const filename = req.file?.filename;
    const { name } = req.body as ISpecialtyBase;
    if (!filename) {
      return http.badRequest(res, "Ícone é obrigatório");
    }

    const { success, error } = validateCreateSpecialtySchema({
      name,
      iconUrl: filename,
    });
    if (!success) {
      if (filename) deleteImageFile(filename);
      return http.badRequest(res, "Dados inválidos", error);
    }

    const specialtyExists = await SpecialtyRepository.findAll(name);
    if (specialtyExists.length > 0) {
      if (filename) deleteImageFile(filename);
      return http.conflict(res, "Especialidade com esse nome já cadastrada");
    }

    const specialty = await SpecialtyRepository.create({ name, iconUrl: filename });
    return http.created(res, "Especialidade criada", specialty);
  }

  static async update(
    req: Request,
    res: Response
  ): Promise<Response<ISpecialty>> {
    const body = req.body;
    const filename = req.file?.filename;

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const specialtyExists = await SpecialtyRepository.findById(id);
    if (!specialtyExists) {
      return http.notFound(res, "Especialidade não encontrada");
    }

    const updateSpecialty = {
      ...specialtyExists,
      name: body?.name ?? specialtyExists.name,
      iconUrl: filename ?? specialtyExists.iconUrl,
      updatedAt: new Date(),
    };

    const { success, error } = validateUpdateSpecialtySchema(updateSpecialty);
    if (!success) {
      if (filename) deleteImageFile(filename);
      return http.badRequest(res, "Dados inválidos", error);
    }

    deleteImageFile(specialtyExists.iconUrl);

    const specialty = await SpecialtyRepository.update(updateSpecialty);
    return http.ok(res, "Especialidade atualizada", specialty);
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const specialtyExists = await SpecialtyRepository.findById(id);
    if (!specialtyExists) {
      return http.notFound(res, "Especialidade não encontrada");
    }

    await SpecialtyRepository.delete(id);
    deleteImageFile(specialtyExists.iconUrl);
    return http.ok(res, "Especialidade deletada", { name: specialtyExists.name });
  }
}
