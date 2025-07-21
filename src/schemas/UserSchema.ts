import z from "zod";
import { IUserBase } from "../interfaces/IUser";
import { UserRole } from "../types/UserRole";

const UserSchema = z.object({
  name: z.string().min(3).max(30),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(UserRole),
});

export function validateCreateUserSchema(data: IUserBase) {
  const result = UserSchema.safeParse(data);

  return {
    success: result.success,
    data: result.data,
    error: result.error?.issues,
  };
}