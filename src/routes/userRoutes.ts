import express from "express";

export const userRoutes = express.Router();

userRoutes.get("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

userRoutes.get("/:id", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
})

userRoutes.post("/", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});
