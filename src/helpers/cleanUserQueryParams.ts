import { IUserBase } from "../interfaces/IUser";

export function cleanUserQueryParams(
  params: Partial<IUserBase>
): Record<string, string> {
  const cleaned: Record<string, string> = {};

  if (params.name) cleaned.name = params.name.trim();

  if (params.email) cleaned.email = params.email.toLowerCase().trim();

  if (params.role) cleaned.role = params.role;

  return cleaned;
}