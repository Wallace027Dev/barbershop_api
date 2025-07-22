import express from "express";

export const router = express.Router();

router.use(express.json());

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/barbers", require("./barberRoutes"));
router.use("/appointments", require("./appointmentRoutes"));
router.use("/specialties", require("./specialtyRoutes"));
