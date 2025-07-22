import { db } from "../../prisma/db";
import { ISpecialty, ISpecialtyBase } from "../interfaces/ISpecialty";

export class SpecialtyRepository {
  static async findAll(name?: string) {
    return await db.specialty.findMany({
      where: {
        name: {
          contains: name
        }
      }
    });
  }

  static async findById(id: string) {
    return await db.specialty.findUnique({
      where: {
        id
      }
    });
  }

  static async create(data: ISpecialtyBase) {
    return await db.specialty.create({
      data
    });
  }

  static async update(data: ISpecialty) {
    return await db.specialty.update({
      where: {
        id: data.id
      },
      data
    });
  }

  static async delete(id: string) {
    return await db.specialty.delete({
      where: {
        id
      }
    });
  }
}
