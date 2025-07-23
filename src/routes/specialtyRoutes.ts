import express from "express";
import { SpecialtyController } from "../controllers/SpecialtyController";

const specialtyRoutes = express.Router();

specialtyRoutes.get("/", SpecialtyController.list);

specialtyRoutes.get("/:id", SpecialtyController.getById);

specialtyRoutes.post("/", SpecialtyController.create);

specialtyRoutes.put("/:id", SpecialtyController.update);

specialtyRoutes.delete("/:id", SpecialtyController.delete);

export default specialtyRoutes;
