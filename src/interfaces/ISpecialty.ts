import { IAppointment } from "./IAppointment";
import { IBarber } from "./IBarber";

export interface ISpecialtyBase {
  name: string;
  iconUrl: string;
}

export interface ISpecialty extends ISpecialtyBase {
  id: string;
  barbers: IBarber[];
  appointments: IAppointment[];
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
