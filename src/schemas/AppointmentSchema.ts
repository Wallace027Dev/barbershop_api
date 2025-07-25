import z from "zod";
import { IAppointmentBase } from "../interfaces/IAppointment";
import { parseSchema } from "./parseSchema";

const AppointmentSchema = z.object({
  date: z.date(),
  canceled: z.boolean(),
  userId: z.uuid(),
  barberId: z.uuid(),
  specialtyId: z.uuid(),
});

export const AppointmentParamsSchema = z.object({
  canceled: z.boolean().optional(),
  minDateTime: z.date().optional(),
  maxDateTime: z.date().optional(),
});

export function validateAppointBaseSchema(data: Partial<IAppointmentBase>) {
  return parseSchema(AppointmentSchema, data);
}

export function validateAppointParamsSchema(data: Partial<IAppointmentBase>) {
  return parseSchema(AppointmentParamsSchema, data);
}
