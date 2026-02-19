import { Specialty } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const createSpecialty = async (payload: Specialty): Promise<Specialty> => {
  const result = await prisma.specialty.create({
    data: payload,
  });
  return result;
};

const getSpecialty = async () => {
  const result = await prisma.specialty.findMany();
  return result;
};

const updateSpecialty = async (
  id: string,
  payload: Specialty,
): Promise<Specialty> => {
  await prisma.specialty.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.specialty.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteSpecialty = async (id: string): Promise<Specialty> => {
  await prisma.specialty.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.specialty.delete({
    where: {
      id,
    },
  });
  return result;
};

export const specialtyService = {
  createSpecialty,
  getSpecialty,
  updateSpecialty,
  deleteSpecialty,
};
