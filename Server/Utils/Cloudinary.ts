import { v2 as cloudinary } from "cloudinary";
import { envVaraibles } from "../env/environmentVar";

cloudinary.config({
  cloud_name: envVaraibles.CLOUD_NAME,
  api_key: envVaraibles.API_KEY,
  api_secret: envVaraibles.API_SECRET,
});

export default cloudinary;
