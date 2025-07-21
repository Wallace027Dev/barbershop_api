import express from "express";

export const appointmentRoutes = express.Router();

appointmentRoutes.get("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

appointmentRoutes.get("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
})

appointmentRoutes.post("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

appointmentRoutes.put("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});
