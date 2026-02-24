import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { setCookieUtils } from "../../utils/cookiesSet";

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

export const authController = {
  authRegister,
  authLogin,
};
