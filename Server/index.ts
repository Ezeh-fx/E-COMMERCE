import express, { Application } from "express";
import dotenv from "dotenv";
import { envVaraibles } from "./env/environmentVar";
import { mainApp } from "./app";
import { DB } from "./config/DB";

dotenv.config();

const port = envVaraibles.PORT || 3000;

const app: Application = express();

mainApp(app);

app.listen(port, () => {
  console.log(`App listening on ${port}`);
  DB();
});

process.on("uncaughtException", (error: Error) => {
  console.log("Error occurred because of uncaught exception");
  console.log(error.message);

  process.exit(1);
});

process.on("unhandledRejection", (reason: any) => {
  console.log("Rejection occurred");
  console.log(reason);

  process.exit(1);
});
