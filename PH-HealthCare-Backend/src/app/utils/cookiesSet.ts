import { Response } from "express";
import { cookieUtils } from "./cookie";

const setAccessToken = (res: Response, token: string) => {
  cookieUtils.setCookies(res, "accessToken", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 60 * 24 * 1000,
  });
};

const setRefreshToken = (res: Response, token: string) => {
  cookieUtils.setCookies(res, "refreshToken", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7 * 1000,
  });
};

const setBetterAuthToken = (res: Response, token: string) => {
  cookieUtils.setCookies(res, "better-auth.session_token", token, {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 60 * 24 * 1000,
  });
};

export const setCookieUtils = {
  setAccessToken,
  setRefreshToken,
  setBetterAuthToken,
};
