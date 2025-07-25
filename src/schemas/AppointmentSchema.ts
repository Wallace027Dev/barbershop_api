import z from "zod";
import { IAppointmentBase } from "../interfaces/IAppointment";
import { parseSchema } from "./parseSchema";

const AppointmentCreateSchema = z.object({
  date: z.date(),
  userId: z.uuid(),
  barberId: z.uuid(),
  specialtyId: z.uuid(),
});

export const AppointmentParamsSchema = z.object({
  canceled: z.boolean().optional(),
  minDateTime: z.date().optional(),
  maxDateTime: z.date().optional(),
});

const AppointmentUpdateSchema = z.object({ canceled: z.boolean() });

export function validateCreateAppointSchema(data: Partial<IAppointmentBase>) {
  return parseSchema(AppointmentCreateSchema, data);
}

export function validateAppointParamsSchema(data: Partial<IAppointmentBase>) {
  return parseSchema(AppointmentParamsSchema, data);
}

export function validateUpdateAppointSchema(data: Partial<IAppointmentBase>) {
  return parseSchema(AppointmentUpdateSchema, data);
}
