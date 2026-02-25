/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../../errorHelper/appError";
import { prisma } from "../../lib/prisma";
import { IAdminUpdate } from "./admin.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../interface/requestUser.interface";

const getAllAdmin = async () => {
  const result = await prisma.admin.findMany({
    where: {
      isDeleted: false,
    },
  });

  return result;
};

const getIdByAdmin = async (id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExists) {
    throw new Error("Admin Not Found");
  }

  return isExists;
};

const updateAdmin = async (payload: IAdminUpdate, id: string) => {
  const isExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  if (!isExists) {
    throw new Error("Admin Not Found");
  }

  const update = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });

  return update;
};

const adminDeleted = async (id: string, user: IRequestUser) => {
  const adminExists = await prisma.admin.findUnique({
    where: {
      id,
    },
  });

  if (!adminExists) {
    throw new Error("Admin not found");
  }

  if (adminExists.id === user.userId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "You cannot delete yourself");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.user.update({
      where: {
        id: adminExists.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: adminExists.userId,
      },
    });

    await tx.account.deleteMany({
      where: {
        userId: adminExists.userId,
      },
    });

    const admin = await getIdByAdmin(id);

    return admin;
  });
  return result;
};

export const adminService = {
  getAllAdmin,
  getIdByAdmin,
  updateAdmin,
  adminDeleted,
};
