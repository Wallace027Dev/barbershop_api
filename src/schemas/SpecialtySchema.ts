import z from "zod";
import { ISpecialtyBase } from "../interfaces/ISpecialty";
import { parseSchema } from "./parseSchema";

const baseSchema = z.object({
  name: z.string().min(3).max(30),
  iconUrl: z.string(),
});

const partialSchema = baseSchema.partial();
const noIconSchema = baseSchema.omit({ iconUrl: true }).partial();

export const validateCreateSpecialtySchema = (data: ISpecialtyBase) =>
  parseSchema(baseSchema, data);

export const validateParamsSpecialty = (data: Partial<ISpecialtyBase>) =>
  parseSchema(noIconSchema, data);

export const validateUpdateSpecialtySchema = (data: Partial<ISpecialtyBase>) =>
  parseSchema(partialSchema, data);
