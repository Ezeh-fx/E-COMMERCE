import mongoose from "mongoose";
import { envVaraibles } from "../env/environmentVar";

const url = envVaraibles.MONGODB_STRING_Live;

export const DB = async () => {
  try {
    const mongo = await mongoose.connect(url);

    console.log(`Database is connected successfully`);
  } catch (error: any) {
    console.log(`Error Connecting reason ${error.message}`);
  }
};
