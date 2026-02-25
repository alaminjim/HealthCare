import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { setCookieUtils } from "../../utils/cookiesSet";
import AppError from "../../../errorHelper/appError";

const authRegister = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authRegister(payload);

  const { refreshToken, accessToken, token, ...spread } = result;

  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, refreshToken);
  setCookieUtils.setBetterAuthToken(res, token as string);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      token,
      ...spread,
    },
  });
});

const authLogin = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const authLogin = await authService.authLogin(payload);

  const { refreshToken, accessToken, token, ...spread } = authLogin;

  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, refreshToken);
  setCookieUtils.setBetterAuthToken(res, token);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      accessToken,
      refreshToken,
      token,
      ...spread,
    },
    message: "Login successful",
  });
});

const authMe = catchFn(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await authService.authMe(user);
  res.status(StatusCodes.OK).json({ success: true, data: result });
});

const getNewToken = catchFn(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  const betterAuthSessionToken = req.cookies["better-auth.session_token"];

  if (!refreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Refresh token is missing");
  }

  const result = await authService.getNewToken(
    refreshToken,
    betterAuthSessionToken,
  );

  const { accessToken, refreshToken: newRefreshToken, sessionToken } = result;
  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, newRefreshToken);
  setCookieUtils.setBetterAuthToken(res, sessionToken);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: { accessToken, refreshToken: newRefreshToken, sessionToken },
  });
});

export const authController = {
  authRegister,
  authLogin,
  authMe,
  getNewToken,
};
