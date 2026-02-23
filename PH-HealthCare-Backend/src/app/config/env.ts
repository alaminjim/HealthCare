import dotenv from "dotenv";
import AppError from "../../errorHelper/appError";
import { StatusCodes } from "http-status-codes";

dotenv.config();

interface EnvConfig {
  NODE_DEV: string;
  PORT: string;
  DATABASE_URL: string;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  ACCESS_TOKEN: string;
  REFRESH_TOKEN: string;
  ACCESS_TOKEN_IN: string;
  REFRESH_TOKEN_IN: string;
}

const envVariables = (): EnvConfig => {
  const requireEnv = [
    "NODE_DEV",
    "PORT",
    "DATABASE_URL",
    "BETTER_AUTH_SECRET",
    "BETTER_AUTH_URL",
  ];

  requireEnv.forEach((variable) => {
    if (!process.env[variable]) {
      throw new AppError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Missing environment variable: ${variable}`,
      );
    }
  });

  return {
    NODE_DEV: process.env.NODE_DEV as string,
    PORT: process.env.PORT as string,
    DATABASE_URL: process.env.DATABASE_URL as string,
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN as string,
    REFRESH_TOKEN: process.env.REFRESH_TOKEN as string,
    ACCESS_TOKEN_IN: process.env.ACCESS_TOKEN_IN as string,
    REFRESH_TOKEN_IN: process.env.REFRESH_TOKEN_IN as string,
  };
};

export const envConfig = envVariables();
