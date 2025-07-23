import express from "express";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import appointmentRoutes from "./appointmentRoutes";
import barberRoutes from "./barberRoutes";
import specialtyRoutes from "./specialtyRoutes";
import { authenticated } from "../middlewares/authenticated";
import { upload } from "../middlewares/multerUpload";
import { errorHandler } from "../middlewares/errorHandler";
import { logRequest } from "../middlewares/logger";

export const router = express.Router();

router.use(express.json());
router.use(logRequest());

router.use("/auth", authRoutes);
router.use("/users", authenticated, userRoutes);
router.use("/appointments", authenticated, appointmentRoutes);
router.use("/barbers", authenticated, upload.single('image'), barberRoutes);
router.use("/specialties", authenticated, upload.single('image'), specialtyRoutes);

router.use((req, res) => res.status(404).json({ message: "Route not found" }));

router.use(errorHandler());
