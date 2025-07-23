import { db } from "../../prisma/db";
import { IBarberBase, IBarber } from "../interfaces/IBarber";

export class BarberRepository {
  static async findAll(params: {
    name?: string;
    age?: number;
    specialties?: string[];
  }) {
    return await db.barber.findMany({
      where: {
        name: params.name
          ? {
              contains: params.name,
              mode: "insensitive",
            }
          : undefined,
        age: params.age,
        specialties: params.specialties
          ? {
              some: {
                specialtyId: {
                  in: params.specialties,
                },
              },
            }
          : undefined,
        deletedAt: null,
      },
    });
  }

  static async findById(id: string) {
    return await db.barber.findUnique({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  static async create(data: IBarberBase) {
  const { specialties, ...barberData } = data;

  return await db.barber.create({
    data: {
      ...barberData,
      specialties: {
        create: specialties.map((id) => ({
          specialty: {
            connect: { id },
          },
        })),
      },
    },
  });
}

  static async update(data: IBarberBase) {
  const { specialties, ...barberData } = data;

  return await db.barber.create({
    data: {
      ...barberData,
      specialties: {
        create: specialties.map((id) => ({
          specialty: {
            connect: { id },
          },
        })),
      },
    },
  });
}

  static async delete(id: string) {
    return await db.barber.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
