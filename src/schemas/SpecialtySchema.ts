import z from "zod";
import { ISpecialtyBase } from "../interfaces/ISpecialty";

const SpecialtySchema = z.object({
  name: z.string().min(3).max(30),
  iconUrl: z.url(),
});

export function validateCreateSpecialtySchema(data: ISpecialtyBase) {
  const result = SpecialtySchema.safeParse(data);

  return {
    success: result.success,
    data: result.data,
    error: result.error?.issues,
  };
}