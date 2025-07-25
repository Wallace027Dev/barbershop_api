import { db } from "../../prisma/db";
import { Prisma } from '../../generated/prisma/client';
import { IAppointment, IAppointmentBase } from "../interfaces/IAppointment";

export class AppointmentRepository {
  static async findAll(params: Prisma.AppointmentWhereInput) {
    return await db.appointment.findMany({
      where: params,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            token: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
            age: true,
            photoUrl: true,
            hiredAt: true,
          },
        },
        specialty: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
      },
    });
  }

  static async findById(id: string) {
    return await db.appointment.findUnique({
      where: {
        id,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            role: true,
            token: true,
          },
        },
        barber: {
          select: {
            id: true,
            name: true,
            age: true,
            photoUrl: true,
            hiredAt: true,
          },
        },
        specialty: {
          select: {
            id: true,
            name: true,
            iconUrl: true,
          },
        },
      },
    });
  }

  static async create(data: IAppointmentBase) {
    return await db.appointment.create({
      data,
    });
  }

  static async update(data: IAppointment) {
    return await db.appointment.update({
      where: {
        id: data.id,
      },
      data,
    });
  }

  static async delete(id: string) {
    return await db.appointment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
