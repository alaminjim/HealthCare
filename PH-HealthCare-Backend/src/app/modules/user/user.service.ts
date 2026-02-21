import { Role, Specialty } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

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
    return doctor;
  } catch (error) {
    console.log(error);
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
};
