import "dotenv/config";

export type Env = {
  host: string;
  port: number;
  nodeEnv: string;
  db: string;
};

export const env: Env = {
  host: process.env.HOST || "localhost",
  port: parseInt(process.env.APP_PORT! || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  db: process.env.DB_FILE_NAME || "mydb.sqlite",
};
