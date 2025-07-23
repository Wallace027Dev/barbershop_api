import z from "zod";
import { IBarberBase } from "../interfaces/IBarber";
import { parseSchema } from "./parseSchema";

const BarberSchema = z.object({
  name: z.string().min(3).max(30),
  age: z.number().min(18).max(100),
  photoUrl: z.string(),
  specialties: z.array(z.string()),
  hiredAt: z.date(),
});

const BarberWithoutPhotoUrl = BarberSchema.omit({ photoUrl: true }).partial();

export function validateBarberWithoutPhotoUrl(data: Partial<IBarberBase>) {
  return parseSchema(BarberWithoutPhotoUrl, data);
}

export function validateCreateBarberSchema(data: Partial<IBarberBase>) {
  return parseSchema(BarberSchema, data);
}