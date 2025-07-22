import express from "express";
import { UserController } from "../controller/UserController";

export const userRoutes = express.Router();

userRoutes.get("/", UserController.getAllUsers);

userRoutes.get("/:id", UserController.getUserById);
