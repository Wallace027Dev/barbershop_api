import express from "express";
import { AuthController } from "../controllers/AuthController";

const authRoutes = express.Router();

authRoutes.post("/signin", AuthController.login);

authRoutes.post("/signup", AuthController.register);

export default authRoutes;
