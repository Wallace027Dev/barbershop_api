import express from "express";
import { AuthController } from "../controller/AuthController";

export const AuthRoutes = express.Router();

AuthRoutes.post("/login", AuthController.login);

AuthRoutes.post("/register", AuthController.register);
