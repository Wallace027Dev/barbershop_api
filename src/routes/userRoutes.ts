import express from "express";
import { UserController } from "../controller/UserController";

export const userRoutes = express.Router();

userRoutes.get("/", UserController.list);

userRoutes.get("/:id", UserController.getById);

userRoutes.post("/", UserController.create);
