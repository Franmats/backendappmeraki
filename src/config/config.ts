import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";

// ✅ En Render NO hay archivos .env, usa Environment Variables
if (env !== "production") {
  dotenv.config({
    path: path.resolve(process.cwd(), `.env.${env}`),
  });
}

export interface Config {
  db_name?: string;
  port?: string;
  db_port?: string;
  db_host?: string;
  db_pass?: string;
  db_user?: string;
  privatekey?: string;
  tn_store_id?: string;
  tn_access_token?: string;
  pedidos_dir?: string;
  images_dir?: string;
  api_url?: string;
}

const config: Config = {
  db_name: process.env.DB_NAME,
  db_port: process.env.DB_PORT,
  port: process.env.PORT,
  db_host: process.env.DB_HOST,
  db_pass: process.env.DB_PASS,
  db_user: process.env.DB_USER,
  privatekey: process.env.PRIVATE_KEY,
  tn_store_id: process.env.TN_STORE_ID,
  tn_access_token: process.env.TN_ACCESS_TOKEN,
  pedidos_dir: process.env.PEDIDOS_DIR,
  images_dir: process.env.IMAGES_DIR,
  api_url: process.env.API_URL,
};

export default config;