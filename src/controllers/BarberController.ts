import http from "../utils/http";
import { Request, Response } from "express";
import { BarberRepository } from "../repositories/BarberRepository";
import { IBarber, IBarberBase } from "../interfaces/IBarber";
import { deleteImageFile } from "../helpers/deleteImageFile";
import {
  validateCreateBarberSchema,
  validateParamsBarber,
  validateUpdateBarberSchema,
} from "../schemas/BarberSchema";

export class BarberController {
  static async list(req: Request, res: Response): Promise<Response<IBarber[]>> {
    const params = req.query as Partial<IBarber>;

    const { success, error } = validateParamsBarber(params);
    if (!success) {
      return res.status(400).json({ message: "Parâmetros inválidos", error });
    }

    const barbers = await BarberRepository.findAll(params);
    if (barbers.length === 0) return http.notFound(res, "Nenhum barbeiro encontrado");

    return http.ok(res, "Barbeiros encontrados", barbers);
  }

  static async getById(
    req: Request,
    res: Response
  ): Promise<Response<IBarber>> {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const barber = await BarberRepository.findById(id);
    if (!barber) return res.status(404).json({ message: "Barbeiro não encontrado" });

    return http.ok(res, "Barbeiro encontrado", barber);
  }

  static async create(req: Request, res: Response): Promise<Response<IBarber>> {
    const body = req.body as IBarberBase;
    const imagePath = req.file?.filename as string;
    body.age = Number(body.age);
    body.hiredAt = new Date(body.hiredAt);

    const { success, error } = validateCreateBarberSchema({
      ...body,
      photoUrl: imagePath,
    });
    if (!success) {
      if (imagePath) deleteImageFile(imagePath);
      return http.badRequest(res, "Dados inválidos", error);
    }

    const barberAlreadyExists = await BarberRepository.findAll({
      name: body.name,
    });
    if (barberAlreadyExists.length > 0) {
      if (imagePath) deleteImageFile(imagePath);
      return http.conflict(res, "Barbeiro com esse nome já cadastrado");
    }

    if (imagePath) {
      body.photoUrl = imagePath;
    } else {
      return http.badRequest(res, "Imagem é obrigatória");
    }

    const barber = await BarberRepository.create(body);
    return http.created(res, "Barbeiro criado", barber);
  }

  static async update(req: Request, res: Response): Promise<Response<IBarber>> {
    const data = req.body as IBarber;

    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const barberExists = await BarberRepository.findById(id);
    if (!barberExists) {
      return http.notFound(res, "Barbeiro não encontrado");
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
      updatedAt: new Date(),
    };

    const { success, error } = validateUpdateBarberSchema(updatedBarber);
    if (!success) {
      if (imagePath) deleteImageFile(imagePath);
      return http.badRequest(res, "Dados inválidos", error);
    }

    const barber = await BarberRepository.update(updatedBarber);
    return http.ok(res, "Barbeiro atualizado", barber);
  }

  static async delete(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({ message: "Id é obrigatório" });
    }

    const barberExists = await BarberRepository.findById(id);
    if (!barberExists) {
      return http.notFound(res, "Barbeiro não encontrado");
    }

    deleteImageFile(barberExists.photoUrl);
    await BarberRepository.delete(id);

    return http.ok(res, "Barbeiro deletado", { name: barberExists.name });
  }
}
