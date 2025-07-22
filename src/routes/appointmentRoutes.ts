import express from "express";
import { AppointmentController } from "../controller/AppointmentController";

export const appointmentRoutes = express.Router();

appointmentRoutes.get("/", AppointmentController.list);

appointmentRoutes.get("/:id", AppointmentController.getById)

appointmentRoutes.post("/", AppointmentController.create);

appointmentRoutes.put("/:id", AppointmentController.update);
