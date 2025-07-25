import http from "../utils/http";
import { Request, Response } from "express";
import { IAppointment, IAppointmentBase } from "../interfaces/IAppointment";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import {
  AppointmentParamsSchema,
  validateAppointBaseSchema,
} from "../schemas/AppointmentSchema";
import { DateTime } from "luxon";
import { toSaoPauloTime } from "../utils/date";

export class AppointmentController {
  static async list(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment[]>> {
    const { canceled, minDateTime, maxDateTime } =
      AppointmentController.parseQueryParams(req.query);

    const validation = AppointmentParamsSchema.safeParse({
      canceled,
      minDateTime,
      maxDateTime,
    });
    if (!validation.success) {
      return http.badRequest(res, "Invalid params", validation.error);
    }

    const {
      canceled: parsedCanceled,
      minDateTime: min,
      maxDateTime: max,
    } = validation.data;

    const createdAtFilter = AppointmentController.buildDateFilter(min, max);

    const query = {
      ...(parsedCanceled !== undefined && { canceled: parsedCanceled }),
      ...(createdAtFilter && { createdAt: createdAtFilter }),
    };

    const appointments = await AppointmentRepository.findAll(query);

    if (appointments.length === 0)
      return http.notFound(res, "Appointments not found");

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
    if (!appointment) return http.notFound(res, "Appointment not found");

    return http.ok(res, "Appointment found", appointment);
  }

  static async create(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const body = req.body as IAppointmentBase;

    // Converter para Date aqui para validar e reutilizar
    const date = DateTime.fromISO(String(body.date), {
      zone: "America/Sao_Paulo",
    }).toJSDate();
    const { success, error } = validateAppointBaseSchema({ ...body, date });
    if (!success) {
      return http.badRequest(res, "Invalid data", error);
    }

    // Obter intervalo do novo agendamento
    const start = date;
    const end = new Date(date.getTime() + 30 * 60 * 1000);

    // Buscar se já há agendamento nesse intervalo
    const hasConflict = await AppointmentRepository.findAll({
      AND: [
        {
          date: {
            lt: end, // começa antes do novo terminar
          },
        },
        {
          date: {
            gt: new Date(start.getTime() - 30 * 60 * 1000), // começa depois do novo início - duração
          },
        },
      ],
    });

    if (hasConflict.length > 0) {
      return http.conflict(res, "Horário já reservado.");
    }

    // Criar o agendamento
    const appointment = await AppointmentRepository.create({
      ...body,
      canceled: false,
      date,
    });
    appointment.date = toSaoPauloTime(appointment.date);

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

    const { success, error } = validateAppointBaseSchema(body);
    if (!success) {
      return http.badRequest(res, "Invalid data", error);
    }

    const updatedAppointment = {
      ...appointmentExists,
      date: new Date(body.date),
      canceled: body.canceled,
      userId: body.userId,
      barberId: body.barberId,
      specialtyId: body.specialtyId,
      updatedAt: new Date(),
    };

    const appointment = await AppointmentRepository.update(updatedAppointment);
    return http.ok(res, "Appointment updated", appointment);
  }

  private static parseQueryParams(query: any) {
    const { canceled, minDateTime, maxDateTime } = query;

    return {
      canceled:
        canceled === "true" ? true : canceled === "false" ? false : undefined,
      minDateTime:
        typeof minDateTime === "string" ? new Date(minDateTime) : undefined,
      maxDateTime:
        typeof maxDateTime === "string" ? new Date(maxDateTime) : undefined,
    };
  }

  private static buildDateFilter(min?: Date, max?: Date) {
    if (min && max) return { gte: min, lte: max };
    if (min) return { gte: min };
    if (max) return { lte: max };
    return undefined;
  }
}
