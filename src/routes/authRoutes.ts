import express from "express";

export const AuthRoutes = express.Router();

AuthRoutes.post("/login", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});

AuthRoutes.post("/register", (req, res) => {
  res.status(405).json({ message: "Method not allowed" });
});
