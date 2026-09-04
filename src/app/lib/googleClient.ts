import { OAuth2Client } from "google-auth-library";
import envConfig from "../config/env";

export const googleClient = new OAuth2Client({
  clientId: envConfig.gClient_id,
});
