import z from "zod";
import { IAppointmentBase } from "../interfaces/IAppointment";

const AppointmentSchema = z.object({
  date: z.iso.date(),
  canceled: z.boolean(),
  userId: z.uuid(),
  barberId: z.uuid(),
  specialtyId: z.uuid(),
});

export function validateCreateAppointmentSchema(data: IAppointmentBase) {
  const result = AppointmentSchema.safeParse(data);

  return {
    success: result.success,
    data: result.data,
    error: result.error?.issues,
  };
}
