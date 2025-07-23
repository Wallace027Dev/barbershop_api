import express from "express";
import path from "node:path";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import appointmentRoutes from "./appointmentRoutes";
import barberRoutes from "./barberRoutes";
import specialtyRoutes from "./specialtyRoutes";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { upload } from "../middlewares/multerUpload";
import { errorHandler } from "../middlewares/errorHandler";
import { logRequest } from "../middlewares/logger";
import { isAdmin } from "../middlewares/isAdmin";

export const router = express.Router();

router.use(express.json());
router.use(logRequest());
router.use("/uploads", express.static(path.resolve(__dirname, "..", "..", "uploads")));

router.use("/auth", authRoutes);
router.use("/users", isAdmin, isAuthenticated, userRoutes);
router.use("/appointments", isAuthenticated, appointmentRoutes);
router.use("/barbers", isAuthenticated, upload.single('image'), barberRoutes);
router.use("/specialties", isAuthenticated, upload.single('image'), specialtyRoutes);

router.use((req, res) => res.status(404).json({ message: "Route not found" }));

router.use(errorHandler());
