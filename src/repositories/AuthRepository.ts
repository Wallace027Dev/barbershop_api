import { db } from "../../prisma/db";
import { IUserBase } from "../interfaces/IUser";

export class AuthRepository {
  static async register(data: IUserBase) {
    return await db.user.create({
      data
    });
  }
}
