import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 10);
  const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET as string);
  const admin = await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@barbershop.com",
      password: passwordHash,
      role: "ADMIN",
      token: token,
    },
  });

  const specialty = await prisma.specialty.create({
    data: {
      name: "Corte Masculino",
      iconUrl: "corte-masculino-127bfa29786ab163d.jpg",
    },
  });

  const barber = await prisma.barber.create({
    data: {
      name: "João Barbeiro",
      age: 30,
      photoUrl: "barbeiro-a0a347c95f34.png",
      hiredAt: new Date("2024-01-01T09:00:00Z"),
    },
  });

  await prisma.barberSpecialty.create({
    data: {
      barberId: barber.id,
      specialtyId: specialty.id,
    },
  });

  await prisma.appointment.create({
    data: {
      date: new Date(Date.now() + 1000 * 60 * 60 * 24), // amanhã
      canceled: false,
      userId: admin.id,
      barberId: barber.id,
      specialtyId: specialty.id,
    },
  });

  console.log("✅ Seed concluído com sucesso");
}

main()
  .catch((e) => {
    console.error("Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
