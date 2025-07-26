import http from "../utils/http";
import { formatToSaoPauloString } from "../utils/date";
import { Request, Response } from "express";
import { IAppointment, IAppointmentBase } from "../interfaces/IAppointment";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { DateTime } from "luxon";
import { UserRepository } from "../repositories/UserRepository";
import {
  AppointmentParamsSchema,
  validateCreateAppointSchema,
} from "../schemas/AppointmentSchema";

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
    if (appointments.length === 0) {
      return http.notFound(res, "Nenhum agendamento encontrado");
    }

    const formattedAppointments = appointments.map(
      (appointment: IAppointment) => ({
        ...appointment,
        date: formatToSaoPauloString(appointment.date),
      })
    );

    return http.ok(res, "Agendamentos não encontrados", formattedAppointments);
  }

  static async getById(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const id = req.params.id;
    if (!id) {
      return http.badRequest(res, "Id é obrigatório");
    }

    const appointment = await AppointmentRepository.findById(id);
    if (!appointment) return http.notFound(res, "Agendamento não encontrado");

    return http.ok(res, "Agendamento não encontrado", {
      ...appointment,
      date: formatToSaoPauloString(appointment.date),
    });
  }

  static async getMyAppointments(
    req: Request,
    res: Response
  ): Promise<Response> {
    const id = req.params.id;
    if (!id) {
      return http.unauthorized(res, "Id é obrigatório");
    }

    const user = await UserRepository.findById(id);
    if (!user) {
      return http.notFound(res, "Usuário não encontrado");
    }

    const appointments = await AppointmentRepository.findAll({
      userId: user.id,
      deletedAt: null,
    });

    return http.ok(res, "Agendamento encontrado", appointments);
  }

  static async create(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const body = req.body as IAppointmentBase;

    const appointmentStart = AppointmentController.parseAndValidateDate(body);
    if (!appointmentStart.success) {
      return http.badRequest(res, "Dados inválidos", appointmentStart.error);
    }

    const date = appointmentStart.date;
    const hour = date.getHours();
    if (hour < 8 || hour >= 18) {
      return http.badRequest(res, "Agendamento disponível apenas de 8h a 18h");
    }

    const conflict = await AppointmentController.hasScheduleConflict(date);
    if (conflict) {
      return http.conflict(res, "Conflito de horários com outro agendamento");
    }

    const appointment = await AppointmentRepository.create({
      ...body,
      date,
      canceled: false,
    });

    return http.created(res, "Agendamento criado", {
      ...appointment,
      date: formatToSaoPauloString(appointment.date),
    });
  }

  static async update(
    req: Request,
    res: Response
  ): Promise<Response<IAppointment>> {
    const id = req.params.id;
    if (!id) {
      return http.badRequest(res, "Id é obrigatório");
    }

    const appointmentExists = await AppointmentRepository.findById(id);
    if (!appointmentExists) {
      return http.notFound(res, "Agendamento não encontrado");
    }

    const now = DateTime.now().setZone("America/Sao_Paulo");
    const appointmentTime = DateTime.fromJSDate(appointmentExists.date).setZone(
      "America/Sao_Paulo"
    );

    const diffInMinutes = appointmentTime.diff(now, "minutes").minutes;
    if (diffInMinutes < 120) {
      return http.forbidden(
        res,
        "Agendamento deve ser cancelado com 2 horas de antecedência"
      );
    }

    const updatedAppointment = {
      ...appointmentExists,
      canceled: true,
      updatedAt: new Date(),
    };

    const appointment = await AppointmentRepository.update(updatedAppointment);

    return http.ok(res, "Agendamento cancelado", {
      ...appointment,
      date: formatToSaoPauloString(appointment.date),
    });
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

  private static parseAndValidateDate(
    body: IAppointmentBase
  ): { success: true; date: Date } | { success: false; error: any } {
    const parsedDate = DateTime.fromISO(String(body.date), {
      zone: "America/Sao_Paulo",
    }).toJSDate();

    const { success, error } = validateCreateAppointSchema({
      ...body,
      date: parsedDate,
    });

    return success
      ? { success: true, date: parsedDate }
      : { success: false, error };
  }

  private static async hasScheduleConflict(
    date: Date,
    durationMinutes = 30
  ): Promise<boolean> {
    const durationMs = durationMinutes * 60 * 1000;
    const start = new Date(date.getTime() - durationMs);
    const end = new Date(date.getTime() + durationMs);

    const conflicts = await AppointmentRepository.findAll({
      AND: [
        { date: { lt: end } },
        { date: { gt: start } },
        { canceled: false },
      ],
    });

    return conflicts.length > 0;
  }
}
