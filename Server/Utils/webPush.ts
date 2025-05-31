import webpush from "web-push";
import { envVaraibles } from "../env/environmentVar";

const publicVapidKey = envVaraibles.PublicKey;
const privateVapidKey = envVaraibles.PrivateKey;

webpush.setVapidDetails(
  "mailto:admin@example.com",
  publicVapidKey,
  privateVapidKey
);

export const adminSubscription = JSON.parse(
  envVaraibles.ADMIN_PUSH_SUBSCRIPTION_JSON
);

export default webpush;
