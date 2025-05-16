import dotenv from "dotenv";

dotenv.config();

export const envVaraibles = {
    PORT: process.env.PORT as string,
    DB_STRING: process.env.MONGODB_STRING as string,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY as string,
    CLIENT_ID : process.env.CLIENT_ID as string,
    CLIENT_SECRET :  process.env.CLIENT_SECRET as string,
    CLIENT_REDIRECT :  process.env.CLIENT_REDIRECT as string,
    REFRESH_TOKEN : process.env.REFRESH_TOKEN as string,
    user : process.env.user as string,
    CLOUD_NAME : process.env.CLOUD_NAME as string,
    API_KEY : process.env.CLOUD_API as string,
    API_SECRET : process.env.CLOUD_SECRET as string,
    secretRefreshToken : process.env.REFRESH as string,
    STRIPE_SECRET_KEY : process.env.STRIPE_SECRET_KEY as string,
    OPENCAGE_API_KEY : process.env.OPENCAGE_API_KEY as string,
    PublicKey : process.env.PublicKey as string,
    PrivateKey : process.env.PrivateKey as string,
    MONGODB_STRING_Live : process.env.MONGODB_STRING_Live as string,
}