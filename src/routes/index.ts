import express from "express";
import path from "node:path";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import appointmentRoutes from "./appointmentRoutes";
import barberRoutes from "./barberRoutes";
import specialtyRoutes from "./specialtyRoutes";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { errorHandler } from "../middlewares/errorHandler";
import { isAdmin } from "../middlewares/isAdmin";

export const router = express.Router();

router.use("/uploads", express.static(path.resolve(__dirname, "..", "..", "uploads")));

router.use("/auth", authRoutes);
router.use("/users", isAuthenticated, isAdmin, userRoutes);
router.use("/appointments", isAuthenticated, appointmentRoutes);
router.use("/barbers", isAuthenticated, barberRoutes);
router.use("/specialties", isAuthenticated, specialtyRoutes);

router.use((req, res) => res.status(404).json({ message: "Route not found" }));

router.use(errorHandler());
