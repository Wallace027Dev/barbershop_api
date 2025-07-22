import { IUserBase } from "../interfaces/IUser";

export function cleanUserQueryParams(
  params: Partial<IUserBase>
): Record<string, string> {
  const cleaned: Record<string, string> = {};

  if (params.name) cleaned.name = params.name.trim();

  if (params.email) {
    const email = params.email.toLowerCase().trim();

    // Regex simples para validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailRegex.test(email)) {
      cleaned.email = email;
    } else {
      return { error: "Invalid email" };
    }
  }

  if (params.role) cleaned.role = params.role;

  return cleaned;
}