export interface IBarberBase {
  name: string;
  age: number;
  photoUrl: string;
  hiredAt: Date;
  specialties: string[];
}

export interface IBarber extends IBarberBase {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}