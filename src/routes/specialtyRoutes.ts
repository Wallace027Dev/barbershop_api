import express from "express";

export const specialtyRoutes = express.Router();

specialtyRoutes.get("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

specialtyRoutes.get("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
})

specialtyRoutes.post("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

specialtyRoutes.put("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

specialtyRoutes.delete("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});
