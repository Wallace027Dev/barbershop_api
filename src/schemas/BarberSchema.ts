import z from "zod";
import { IBarberBase } from "../interfaces/IBarber";

const BarberSchema = z.object({
  name: z.string().min(3).max(30),
  age: z.number().min(18).max(100),
  photoUrl: z.url(),
  specialties: z.array(z.string()),
});

export function validateCreateBarberSchema(data: IBarberBase) {
  const result = BarberSchema.safeParse(data);

  return {
    success: result.success,
    data: result.data,
    error: result.error?.issues,
  };
}