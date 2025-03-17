import mongoose from "mongoose";
import { envVaraibles } from "../env/environmentVar";

const url = envVaraibles.DB_STRING;

export const DB = async () => {
  try {
    const mongo = await mongoose.connect(url);

    console.log(`Database is connected successfully`);
  } catch (error: any) {
    console.log(`Error Connecting reason ${error.message}`);
  }
};
