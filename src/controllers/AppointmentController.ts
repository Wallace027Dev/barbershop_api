import { Request, Response } from "express";
import { IAppointment, IAppointmentBase } from "../interfaces/IAppointment";
import { validateAppointBaseSchema } from "../schemas/AppointmentSchema";
import http from "../utils/http";
import { AppointmentRepository } from "../repositories/AppointmentRepository";

export class AppointmentController {
  static async list(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment[]>> {
    const params = req.query as Partial<IAppointmentBase>;

    const { success, data, error } = validateAppointBaseSchema(params);
    if (!success || !data) {
      return http.badRequest(res, "Invalid params", error);
    }

    const appointments = await AppointmentRepository.findAll(params);
    return http.ok(res, "Appointments found", appointments);
  }

  static async getById(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const id = req.params.id;
    if (!id) {
      return http.badRequest(res, "Id is required");
    }

    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) {
      return http.notFound(res, "Appointment not found");
    }

    return http.ok(res, "Appointment found", appointment);
  }

  static async create(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const body = req.body as IAppointmentBase;

    const { success, data, error } = validateAppointBaseSchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    const appointment = await AppointmentRepository.create(body);
    return http.created(res, "Appointment created", appointment);
  }

  static async update(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const body = req.body as IAppointmentBase;

    const id = req.params.id;
    if (!id) {
      return http.badRequest(res, "Id is required");
    }

    const appointmentExists = await AppointmentRepository.findById(id);
    if (!appointmentExists) {
      return http.notFound(res, "Appointment not found");
    }

    const { success, data, error } = validateAppointBaseSchema(body);
    if (!success || !data) {
      return http.badRequest(res, "Invalid data", error);
    }

    const updatedAppointment = {
      ...appointmentExists,
      date: new Date(data.date),
      canceled: data.canceled,
      userId: data.userId,
      barberId: data.barberId,
      specialtyId: data.specialtyId,
      updatedAt: new Date()
    };

    const appointment = await AppointmentRepository.update(updatedAppointment);
    return http.ok(res, "Appointment updated", appointment);
  }
}
