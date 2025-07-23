import { UserRole } from "../types/UserRole";

export interface IUserBase {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IUser extends IUserBase {
  id: string;
  token?: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}