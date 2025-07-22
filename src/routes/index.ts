import express from "express";
import multer from "multer";
import path from "node:path";

export const router = express.Router();

router.use(express.json());

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, path.resolve(__dirname, "..", "..", "uploads"));
    },
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`);
    }
  })
});

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/appointments", require("./appointmentRoutes"));
router.use("/barbers", upload.single('image'), require("./barberRoutes"));
router.use("/specialties", upload.single('image'), require("./specialtyRoutes"));
