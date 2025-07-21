import express from "express";

export const barberRoutes = express.Router();

barberRoutes.get("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

barberRoutes.get("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
})

barberRoutes.post("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

barberRoutes.put("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

barberRoutes.delete("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});
