import { Role } from "@prisma/client";

export interface IUserBase {
  name: string;
  email: string;
  password: string;
  role: Role;
  token: string;
}

export type IUserValidate = Omit<IUser, "token">;

export interface IUser extends IUserBase {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}