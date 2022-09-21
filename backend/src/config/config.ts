import "https://deno.land/x/dotenv/load.ts";
const env = Deno.env.toObject();
const PORT = env.PORT || 8080;
const SECRET_KEY = env.SECRET_KEY;
const TOKEN_EXPIRED = 1000 * 60 * 60 * 8 // 8 hours;
const DB_NAME = env.DB_NAME;
const DB_HOST_URL = env.DB_HOST_URL;

export {
  PORT,
  SECRET_KEY,
  TOKEN_EXPIRED,
  DB_NAME,
  DB_HOST_URL
}
