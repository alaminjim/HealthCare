import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { tokenUtils } from "../../utils/token";

const authRegister = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authRegister(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);
  tokenUtils.setBetterAuth(res, token as string);

  res.status(StatusCodes.OK).json({
    success: true,
    data: { accessToken, refreshToken, token, ...rest },
  });
});

const authLogin = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const result = await authService.authLogin(payload);

  const { accessToken, refreshToken, token, ...rest } = result;

  tokenUtils.setAccessToken(res, accessToken);
  tokenUtils.setRefreshToken(res, refreshToken);
  tokenUtils.setBetterAuth(res, token as string);

  res.status(StatusCodes.OK).json({
    success: true,
    data: {
      token,
      accessToken,
      refreshToken,
      ...rest,
    },
    message: "Login successful",
  });
});

export const authController = {
  authRegister,
  authLogin,
};
