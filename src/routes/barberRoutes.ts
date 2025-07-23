import express from "express";
import { BarberController } from "../controllers/BarberController";
import { isAdmin } from "../middlewares/isAdmin";
import { upload } from "../middlewares/multerUpload";

const barberRoutes = express.Router();

barberRoutes.get("/", BarberController.list);

barberRoutes.get("/:id", BarberController.getById);

barberRoutes.post("/", isAdmin, upload.single('image'), BarberController.create);

barberRoutes.put("/:id", isAdmin, BarberController.update);

barberRoutes.delete("/:id", isAdmin, BarberController.delete);

export default barberRoutes;
