import express from "express";
import { UserController } from "../controllers/UserController";

const userRoutes = express.Router();

userRoutes.get("/", UserController.getAllUsers);

userRoutes.get("/:id", UserController.getUserById);

export default userRoutes;
