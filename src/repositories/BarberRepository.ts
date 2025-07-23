import { db } from "../../prisma/db";
import { IBarberBase, IBarber } from "../interfaces/IBarber";

export class BarberRepository {
  static async findAll(params: {
    name?: string;
    age?: number;
    specialties?: string[];
  }) {
    return await db.barber.findMany({
      where: params,
    });
  }

  static async findById(id: string) {
    return await db.barber.findUnique({
      where: {
        id,
      },
    });
  }

  static async create(data: IBarberBase) {
    return await db.barber.create({
      data,
    });
  }

  static async update(data: IBarber) {
    return await db.barber.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  static async delete(id: string) {
    return await db.barber.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
