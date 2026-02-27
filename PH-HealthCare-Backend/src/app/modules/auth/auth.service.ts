import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelper/appError";
import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";
import { jwtUtils } from "../../utils/jwt";
import { envConfig } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

type IRegister = {
  name: string;
  email: string;
  password: string;
};

type ILogin = {
  email: string;
  password: string;
};

interface IChangedPass {
  currentPassword: string;
  newPassword: string;
}

const authRegister = async (payload: IRegister) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new Error("User Created failed");
  }

  try {
    const patient = await prisma.$transaction(async (tx) => {
      const patientTx = await tx.patient.create({
        data: {
          userId: data.user.id,
          name: payload.name,
          email: payload.email,
        },
      });
      return patientTx;
    });

    const accessToken = tokenUtils.accessToken({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    const refreshToken = tokenUtils.refreshToken({
      userId: data.user.id,
      name: data.user.name,
      email: data.user.email,
      emailVerified: data.user.emailVerified,
      role: data.user.role,
      status: data.user.status,
      isDeleted: data.user.isDeleted,
    });

    return {
      ...data,
      patient,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: data.user.id,
      },
    });
    throw error;
  }
};

const authLogin = async (payload: ILogin) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (data.user.status === UserStatus.BLOCKED) {
    throw new Error("User blocked");
  }

  if (data.user.isDeleted && data.user.status === UserStatus.DELETED) {
    throw new Error("User Deleted");
  }

  const accessToken = tokenUtils.accessToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });

  const refreshToken = tokenUtils.refreshToken({
    userId: data.user.id,
    name: data.user.name,
    email: data.user.email,
    emailVerified: data.user.emailVerified,
    role: data.user.role,
    status: data.user.status,
    isDeleted: data.user.isDeleted,
  });

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

const authMe = async (user: IRequestUser) => {
  const userExists = await prisma.user.findUnique({
    where: {
      id: user.userId,
    },
    include: {
      patient: {
        include: {
          appointments: true,
          reviews: true,
          prescriptions: true,
          medicalReports: true,
          patientHealthData: true,
        },
      },
      doctor: {
        include: {
          specialties: true,
          appointments: true,
          reviews: true,
          prescriptions: true,
        },
      },
      admin: true,
    },
  });
  if (!userExists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  return userExists;
};

const getNewToken = async (refreshToken: string, sessionToken: string) => {
  const sessionTokenExists = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!sessionTokenExists) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid session token");
  }

  const verifiedRefreshToken = await jwtUtils.verifiedToken(
    refreshToken,
    envConfig.REFRESH_TOKEN,
  );

  if (!verifiedRefreshToken.success) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const data = verifiedRefreshToken as JwtPayload;

  const newAccessToken = tokenUtils.accessToken({
    userId: data.id,
    name: data.name,
    email: data.email,
    emailVerified: data.emailVerified,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
  });

  const newRefreshToken = tokenUtils.refreshToken({
    userId: data.id,
    name: data.name,
    email: data.email,
    emailVerified: data.emailVerified,
    role: data.role,
    status: data.status,
    isDeleted: data.isDeleted,
  });

  const { token } = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
      updatedAt: new Date(),
    },
  });

  return {
    newAccessToken,
    newRefreshToken,
    token,
  };
};

const changePassword = async (payload: IChangedPass, sessionToken: string) => {
  const session = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!session) {
    throw new Error("Invalid Session Token");
  }

  const { currentPassword, newPassword } = payload;

  const result = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (session.user.needPasswordChange) {
    await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        needPasswordChange: false,
      },
    });
  }

  const accessToken = tokenUtils.accessToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  const refreshToken = tokenUtils.refreshToken({
    userId: session.user.id,
    role: session.user.role,
    name: session.user.name,
    email: session.user.email,
    status: session.user.status,
    isDeleted: session.user.isDeleted,
    emailVerified: session.user.emailVerified,
  });

  return {
    ...result,
    accessToken,
    refreshToken,
  };
};

const logOut = async (sessionToken: string) => {
  const result = await auth.api.signOut({
    headers: new Headers({
      Authentication: `Bearer ${sessionToken}`,
    }),
  });
  return result;
};

const emailVerification = async (email: string, otp: string) => {
  const user = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if (user.user && !user.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && !user.emailVerified) {
    throw new Error("User Not verified");
  }

  if (user?.status === UserStatus.BLOCKED) {
    throw new Error("User has blocked");
  }

  if (user?.status === UserStatus.DELETED) {
    throw new Error("user deleted");
  }

  await auth.api.requestPasswordResetEmailOTP({
    body: {
      email,
    },
  });
};

const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (user && !user.emailVerified) {
    throw new Error("User Not verified");
  }

  if (user?.status === UserStatus.BLOCKED) {
    throw new Error("User has blocked");
  }

  if (user?.isDeleted || user?.status === UserStatus.DELETED) {
    throw new Error("user deleted");
  }

  await auth.api.resetPasswordEmailOTP({
    body: {
      email,
      otp,
      password: newPassword,
    },
  });

  await prisma.session.deleteMany({
    where: {
      userId: user?.id,
    },
  });
};

export const authService = {
  authRegister,
  authLogin,
  authMe,
  getNewToken,
  changePassword,
  logOut,
  emailVerification,
  forgotPassword,
  resetPassword,
};
