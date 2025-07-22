import { db } from "../../prisma/db";
import { IAppointment, IAppointmentBase } from "../interfaces/IAppointment";

export class AppointmentRepository {
  static async findAll(params: Partial<IAppointmentBase>) {
    return await db.appointment.findMany({
      where: params
    });
  }

  static async findById(id: string) {
    return await db.appointment.findUnique({
      where: {
        id
      }
    });
  }

  static async create(data: IAppointmentBase) {
    return await db.appointment.create({
      data
    });
  }

  static async update(data: IAppointment) {
    return await db.appointment.update({
      where: {
        id: data.id
      },
      data
    });
  }
}
