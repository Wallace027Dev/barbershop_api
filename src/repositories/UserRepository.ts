import { db } from "../../prisma/db";
import { IUser, IUserBase } from "../interfaces/IUser";

export class UserRepository {
  static async findAll(params: {
    name?: string;
    email?: string;
    role?: string;
  }) {
    return await db.user.findMany({
      where: params
    });
  }

  static async findById(id: string) {
    return await db.user.findUnique({
      where: {
        id
      }
    });
  }

  static async create(data: IUserBase) {
    return await db.user.create({
      data
    });
  }

  static async update(data: IUser) {
    return await db.user.update({
      where: {
        id: data.id
      },
      data
    });
  }

  static async delete(id: string) {
    return await db.user.delete({
      where: {
        id
      }
    });
  }
}
