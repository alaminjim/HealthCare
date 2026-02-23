import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envConfig } from "../config/env";

const getAccessToken = (payload: JwtPayload) => {
  const accessToken = jwtUtils.createToken(payload, envConfig.ACCESS_TOKEN, {
    expiresIn: envConfig.ACCESS_TOKEN_IN,
  } as SignOptions);
  return accessToken;
};

const getRefreshToken = (payload: JwtPayload) => {
  const refreshToken = jwtUtils.createToken(payload, envConfig.REFRESH_TOKEN, {
    expiresIn: envConfig.REFRESH_TOKEN_IN,
  } as SignOptions);
  return refreshToken;
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
};
