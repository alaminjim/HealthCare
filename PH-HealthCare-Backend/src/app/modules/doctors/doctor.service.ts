import { prisma } from "../../lib/prisma";

const getAllDoctor = async () => {
  return await prisma.doctor.findMany({
    select: {
      user: true,
      specialties: {
        select: {
          special: true,
        },
      },
    },
  });
};

const getDoctorById = async (id: string) => {
  const isExists = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!isExists) {
    throw new Error("Doctor Not Found");
  }

  const result = await prisma.doctor.findUnique({
    where: {
      id,
    },
    select: {
      user: true,
      specialties: {
        select: {
          special: true,
        },
      },
    },
  });
  return result;
};

export const doctorService = {
  getAllDoctor,
  getDoctorById,
};
