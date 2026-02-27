import { Request, Response } from "express";
import catchFn from "../../shared/catchFn";
import { authService } from "./auth.service";
import { StatusCodes } from "http-status-codes";
import { setCookieUtils } from "../../utils/cookiesSet";
import AppError from "../../../errorHelper/appError";
import { cookieUtils } from "../../utils/cookie";
import { envConfig } from "../../config/env";
import { auth } from "../../lib/auth";

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

  const { newAccessToken, newRefreshToken, token } = result;

  setCookieUtils.setAccessToken(res, newAccessToken);
  setCookieUtils.setRefreshToken(res, newRefreshToken);
  setCookieUtils.setBetterAuthToken(res, token);

  res.status(StatusCodes.CREATED).json({
    success: true,
    data: { newAccessToken, newRefreshToken, token },
  });
});

const changePassword = catchFn(async (req: Request, res: Response) => {
  const payload = req.body;
  const sessionToken = req.cookies["better-auth.session_token"];

  const result = await authService.changePassword(payload, sessionToken);

  const { accessToken, refreshToken, token } = result;

  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, refreshToken);
  setCookieUtils.setBetterAuthToken(res, token as string);

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Password Change SuccessFul",
    data: result,
  });
});

const logOut = catchFn(async (req: Request, res: Response) => {
  const sessionToken = req.cookies["better-auth.session_token"];

  await authService.logOut(sessionToken);

  cookieUtils.clearCookies(res, "accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  cookieUtils.clearCookies(res, "refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  cookieUtils.clearCookies(res, "better-auth.session_token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "logout SuccessFul",
    data: null,
  });
});

const emailVerification = catchFn(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.emailVerification(email, otp);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Email Verified SuccessFul",
  });
});

const forgotPassword = catchFn(async (req: Request, res: Response) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Forgot password SuccessFul",
  });
});

const resetPassword = catchFn(async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  await authService.resetPassword(email, otp, newPassword);
  res.status(StatusCodes.CREATED).json({
    success: true,
    message: "Password Reset SuccessFul",
  });
});

const googleLogin = catchFn(async (req: Request, res: Response) => {
  const redirectPath = req.query.redirect || "/";

  const encodedRedirect = encodeURIComponent(redirectPath as string);

  const callbackURL = `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirect}`;

  res.render("googleRedirect", {
    callbackURL,
    betterAuthUrl: envConfig.BETTER_AUTH_URL,
  });
});

const googleLoginSuccess = catchFn(async (req: Request, res: Response) => {
  const redirectPath = (req.query.redirect as string) || "/";

  const sessionToken = req.cookies["better-auth.session_token"];

  if (!sessionToken) {
    return res.redirect(
      `${envConfig.BETTER_AUTH_URL}/login?error=oAuth-failed`,
    );
  }

  const session = await auth.api.getSession({
    headers: {
      Cookie: `better-auth.session_auth=${sessionToken}`,
    },
  });

  if (!session) {
    return res.redirect(
      `${envConfig.BETTER_AUTH_URL}/login?error=session_not_found`,
    );
  }

  if (session && !session.user) {
    return res.redirect(
      `${envConfig.BETTER_AUTH_URL}/login?error=user_not_found`,
    );
  }

  const result = await authService.googleLoginSuccess(session);

  const { accessToken, refreshToken } = result;

  setCookieUtils.setAccessToken(res, accessToken);
  setCookieUtils.setRefreshToken(res, refreshToken);

  const isValidRedirectPath =
    redirectPath.startsWith("/") && !redirectPath.startsWith("//");

  const finalPath = isValidRedirectPath ? redirectPath : "/";

  res.redirect(`${envConfig.BETTER_AUTH_URL}${finalPath}`);
});

export const authController = {
  authRegister,
  authLogin,
  authMe,
  getNewToken,
  changePassword,
  logOut,
  emailVerification,
  forgotPassword,
  resetPassword,
  googleLogin,
  googleLoginSuccess,
};
