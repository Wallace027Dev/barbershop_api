import z from "zod";
import { ISpecialtyBase } from "../interfaces/ISpecialty";
import { parseSchema } from "./parseSchema";

const SpecialtySchema = z.object({
  name: z.string().min(3).max(30),
  iconUrl: z.url(),
});

const SpecialtyWithoutIconUrl = SpecialtySchema.omit({ iconUrl: true }).partial();

export function validateCreateSpecialtySchema(data: ISpecialtyBase) {
  return parseSchema(SpecialtySchema, data);
}

export function validateSpecialtyWithoutIconUrl(data: Partial<ISpecialtyBase>) {
  return parseSchema(SpecialtyWithoutIconUrl, data);
}