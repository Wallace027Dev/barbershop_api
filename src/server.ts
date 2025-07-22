import express from "express";
import "dotenv/config";
import { router } from "./routes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(router);

app
  .listen(PORT, () => console.log("Server is running"))
  .on("error", (err) => console.log(err));
