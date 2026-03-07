/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role, Specialty } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  ICreateAdmin,
  ICreateDoctorPayload,
  ICreateSuperAdmin,
} from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialty: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialties = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });
    if (!specialties) {
      throw new Error("Specialties Not found");
    }
    specialty.push(specialties);
  }

  const isExists = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (isExists) {
    throw new Error("Email Al Ready exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      role: Role.DOCTOR,
      password: payload.password,
      needPasswordChange: true,
    },
  });

  try {
    const doctor = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: userData.user.id,
          ...payload.doctor,
        },
      });

      const specialtiesData = specialty.map((special) => {
        return {
          specialId: special.id,
          doctorId: doctorData.id,
        };
      });

      await tx.doctorSpecialty.createMany({
        data: specialtiesData,
      });

      const doctor = await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          address: true,
          registrationNumber: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              status: true,
              emailVerified: true,
            },
          },
          specialties: {
            select: {
              special: true,
            },
          },
        },
      });
      return doctor;
    });
    console.log(doctor);
    return doctor;
  } catch (error: any) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

const createAdmin = async (payload: ICreateAdmin) => {
  const isExists = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (isExists) {
    throw new Error("Email al ready exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.admin.email,
      password: payload.password,
      role: Role.ADMIN,
      name: payload.admin.name,
      needPasswordChange: true,
      rememberMe: false,
    },
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const admin = await tx.admin.create({
        data: {
          userId: userData.user.id,
          name: payload.admin.name,
          email: payload.admin.email,
          role: Role.ADMIN,
          profilePhoto: payload.admin.profilePhoto,
          contactNumber: payload.admin.contactNumber,
          description: payload.admin.description,
        },
      });

      const result = await tx.admin.findMany({
        where: {
          id: admin.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });
      return result;
    });
    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

const createSuperAdmin = async (payload: ICreateSuperAdmin) => {
  const isExists = await prisma.user.findUnique({
    where: {
      email: payload.superAdmin.email,
    },
  });

  if (isExists) {
    throw new Error("Email al ready exists");
  }

  const userData = await auth.api.signUpEmail({
    body: {
      email: payload.superAdmin.email,
      password: payload.password,
      role: Role.SUPER_ADMIN,
      name: payload.superAdmin.name,
      needPasswordChange: true,
      rememberMe: false,
    },
  });
  try {
    const result = await prisma.$transaction(async (tx) => {
      const superAdmin = await tx.superAdmin.create({
        data: {
          userId: userData.user.id,
          name: payload.superAdmin.name,
          email: payload.superAdmin.email,
          role: Role.SUPER_ADMIN,
          profilePhoto: payload.superAdmin.profilePhoto,
          contactNumber: payload.superAdmin.contactNumber,
          description: payload.superAdmin.description,
        },
      });

      const result = await tx.superAdmin.findMany({
        where: {
          id: superAdmin.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              status: true,
            },
          },
        },
      });
      return result;
    });
    return result;
  } catch (error) {
    await prisma.user.delete({
      where: {
        id: userData.user.id,
      },
    });
    throw error;
  }
};

export const userService = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
};
