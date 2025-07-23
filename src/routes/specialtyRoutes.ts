import express from "express";
import { SpecialtyController } from "../controllers/SpecialtyController";
import { isAdmin } from "../middlewares/isAdmin";

const specialtyRoutes = express.Router();

specialtyRoutes.get("/", SpecialtyController.list);

specialtyRoutes.get("/:id", SpecialtyController.getById);

specialtyRoutes.post("/", isAdmin, SpecialtyController.create);

specialtyRoutes.put("/:id", isAdmin, SpecialtyController.update);

specialtyRoutes.delete("/:id", isAdmin, SpecialtyController.delete);

export default specialtyRoutes;
