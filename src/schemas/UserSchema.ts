import z from "zod";
import { IUserBase } from "../interfaces/IUser";
import { UserRole } from "../types/UserRole";

const BaseUserSchema = z.object({
  name: z.string().min(3, "Nome muito curto").max(30, "Nome muito longo"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha muito curta"),
  role: z.enum(UserRole),
});

const UserSchemaWithoutPassword = BaseUserSchema.omit({ password: true }).partial();

function parseSchema<T>(schema: z.ZodType<T>, data: unknown) {
  const result = schema.safeParse(data);
  return {
    success: result.success,
    data: result.success ? result.data : undefined,
    error: result.error?.issues,
  };
}

export function validateCreateUserSchema(data: IUserBase) {
  return parseSchema(BaseUserSchema, data);
}

export function validateUserWithoutPassword(data: Partial<IUserBase>) {
  return parseSchema(UserSchemaWithoutPassword, data);
}
