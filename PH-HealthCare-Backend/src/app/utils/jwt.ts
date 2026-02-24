/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const createToken = (
  data: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(data, secret, { expiresIn });
  return token;
};

const verifiedToken = (token: string, secret: string) => {
  try {
    const verified = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true,
      verified,
    };
  } catch (error: any) {
    return {
      error,
      message: error.message,
    };
  }
};

const decodedToken = (token: string) => {
  const decoded = jwt.decode(token) as JwtPayload;

  return decoded;
};

export const jwtUtils = {
  createToken,
  verifiedToken,
  decodedToken,
};
