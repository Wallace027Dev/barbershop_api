import express from "express";

export const routes = express.Router();

routes.use("/auth", require("./authRoutes"));
routes.use("/users", require("./userRoutes"));
routes.use("/barbers", require("./barberRoutes"));
routes.use("/appointments", require("./appointmentRoutes"));
routes.use("/specialties", require("./specialtyRoutes"));