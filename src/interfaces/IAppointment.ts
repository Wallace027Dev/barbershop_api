export interface IAppointmentBase {
  date: Date;
  canceled: boolean;
  userId: string;
  barberId: string;
  specialtyId: string;
}

export interface IAppointment extends IAppointmentBase {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
