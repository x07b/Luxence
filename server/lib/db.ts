import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "lightsdb",
  user: process.env.DB_USER || "lightsuser",
  password: process.env.DB_PASSWORD || "root",
});
