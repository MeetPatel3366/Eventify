import { Google } from "arctic";
import dotenv from "dotenv";
dotenv.config();

const google = new Google(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL,
);

export default google;
