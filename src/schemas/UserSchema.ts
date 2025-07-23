import z from "zod";
import { IUserBase } from "../interfaces/IUser";
import { UserRole } from "../types/UserRole";
import { parseSchema } from "./parseSchema";

const BaseUserSchema = z.object({
  name: z.string().min(1, "Nome muito curto").max(30, "Nome muito longo"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
  role: z.enum(UserRole).optional(),
});

const UserSchemaWithoutPassword = BaseUserSchema.omit({ password: true }).partial();

export function validateCreateUserSchema(data: IUserBase) {
  return parseSchema(BaseUserSchema, data);
}

export function validateUserWithoutPassword(data: Partial<IUserBase>) {
  return parseSchema(UserSchemaWithoutPassword, data);
}
