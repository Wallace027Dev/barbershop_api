import z from "zod";
import { IAppointmentBase } from "../interfaces/IAppointment";
import { parseSchema } from "./parseSchema";

const AppointmentSchema = z.object({
  date: z.iso.date(),
  canceled: z.boolean(),
  userId: z.uuid(),
  barberId: z.uuid(),
  specialtyId: z.uuid(),
});

export function validateAppointBaseSchema(data: Partial<IAppointmentBase>) {
  return parseSchema(AppointmentSchema, data);
}
