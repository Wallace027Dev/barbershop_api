export interface IBarberBase {
  name: string;
  age: number;
  photoUrl: string;
  specialties: string[];
}

export interface IBarber extends IBarberBase {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  deletedAt: Date | null;
}