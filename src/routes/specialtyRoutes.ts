import express from "express";
import { SpecialtyController } from "../controllers/SpecialtyController";
import { isAdmin } from "../middlewares/isAdmin";
import { upload } from "../middlewares/multerUpload";

const specialtyRoutes = express.Router();

specialtyRoutes.get("/", SpecialtyController.list);

specialtyRoutes.get("/:id", SpecialtyController.getById);

specialtyRoutes.post("/", isAdmin, upload.single('image'), SpecialtyController.create);

specialtyRoutes.put("/:id", isAdmin, upload.single('image'), SpecialtyController.update);

specialtyRoutes.delete("/:id", isAdmin, SpecialtyController.delete);

export default specialtyRoutes;
