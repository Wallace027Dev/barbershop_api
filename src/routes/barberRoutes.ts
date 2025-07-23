import express from "express";
import { BarberController } from "../controllers/BarberController";

export const barberRoutes = express.Router();

barberRoutes.get("/", BarberController.list);

barberRoutes.get("/:id", BarberController.getById);

barberRoutes.post("/", BarberController.create);

barberRoutes.put("/:id", BarberController.update);

barberRoutes.delete("/:id", BarberController.delete);
