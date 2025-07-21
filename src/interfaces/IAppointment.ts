export interface IAppointmentBase {
  date: Date;
  canceled: boolean;
  user_id: string;
  barber_id: string;
  specialty_id: string;
}

export interface IAppointment extends IAppointmentBase {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}
