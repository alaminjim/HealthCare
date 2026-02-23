import { JwtPayload, SignOptions } from "jsonwebtoken";
import { jwtUtils } from "./jwt";
import { envConfig } from "../config/env";
import { Response } from "express";
import { cookieUtils } from "./cookie";

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

const setAccessToken = (res: Response, token: string) => {
  const refreshToken = cookieUtils.setCookie(res, "accessToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 60 * 24,
  });
  return refreshToken;
};

const setRefreshToken = (res: Response, token: string) => {
  const refreshToken = cookieUtils.setCookie(res, "refreshToken", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    maxAge: 60 * 60 * 60 * 24 * 7,
  });
  return refreshToken;
};

const setBetterAuth = (res: Response, token: string) => {
  if (!token) return;
  const betterToken = cookieUtils.setCookie(
    res,
    "better-auth.session_token",
    token,
    {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      path: "/",
      maxAge: 60 * 60 * 60 * 24,
    },
  );
  return betterToken;
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setBetterAuth,
  setRefreshToken,
};
