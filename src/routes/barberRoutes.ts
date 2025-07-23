import express from "express";
import { BarberController } from "../controllers/BarberController";
import { isAdmin } from "../middlewares/isAdmin";

const barberRoutes = express.Router();

barberRoutes.get("/", BarberController.list);

barberRoutes.get("/:id", BarberController.getById);

barberRoutes.post("/", isAdmin, BarberController.create);

barberRoutes.put("/:id", isAdmin, BarberController.update);

barberRoutes.delete("/:id", isAdmin, BarberController.delete);

export default barberRoutes;
