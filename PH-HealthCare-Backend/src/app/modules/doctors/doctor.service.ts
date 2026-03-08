import { Doctor, Prisma } from "../../../generated/prisma/client";
import { IQueryParams } from "../../interface/queryBuilders.i";
import { prisma } from "../../lib/prisma";
import { QueryBuilders } from "../../utils/queryBuilder";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctor = async (query: IQueryParams) => {
  // const result = await prisma.doctor.findMany({
  //   where: {
  //     isDeleted: false,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  //   select: {
  //     id: true,
  //     name: true,
  //     email: true,
  //     profilePhoto: true,
  //     contactNumber: true,
  //     registrationNumber: true,
  //     experience: true,
  //     gender: true,
  //     appointmentFee: true,
  //     qualification: true,
  //     currentWorkingPlace: true,
  //     designation: true,
  //     averageRating: true,
  //     createdAt: true,
  //     specialties: {
  //       select: {
  //         special: true,
  //       },
  //     },
  //   },
  // });
  // const doctor = result.map((dc) => ({
  //   ...dc,
  //   specialties: dc.specialties.map((s) => s.special),
  // }));
  // return doctor;

  const queryBuilder = new QueryBuilders<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchQueryFields: doctorSearchableFields,
    filterQueryFields: doctorFilterableFields,
  });

  const result = await queryBuilder
    .search()
    .filter()
    .where({
      isDeleted: false,
    })
    .include({
      // user: true,
      // specialties: {
      //   include: {
      //     special: true,
      //   },
      // },
    })
    .dynamicInclude(doctorIncludeConfig, ["user"])
    .paginate()
    .sort()
    .fields()
    .execute();

  return result;
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
      isDeleted: false,
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

  return {
    ...result,
    specialties: result?.specialties.map((s) => s.special),
  };
};

const updateDoctor = async (payload: IUpdateDoctorPayload, id: string) => {
  const isExists = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });

  if (!isExists) {
    throw new Error("Doctor Not Found");
  }

  const { specialties, ...doctorData } = payload;

  const result = await prisma.doctor.update({
    where: {
      id,
    },
    data: doctorData as Prisma.DoctorUpdateInput,
    select: {
      specialties: {
        select: {
          special: true,
        },
      },
    },
  });

  if (specialties && specialties.length > 0) {
    await prisma.doctorSpecialty.deleteMany({
      where: {
        doctorId: id,
      },
    });

    const specialtiesData = specialties.map((specialId) => {
      return {
        doctorId: id,
        specialId,
      };
    });

    await prisma.doctorSpecialty.createMany({
      data: specialtiesData,
    });

    const result = await prisma.doctor.findUnique({
      where: { id },
      include: {
        specialties: {
          include: {
            special: true,
          },
        },
      },
    });

    return {
      ...result,
      specialties: result?.specialties.map((s) => s.special || []),
    };
  }

  return {
    ...result,
    specialties: result.specialties.map((s) => s.special),
  };
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id,
    },
  });

  if (!doctor) {
    throw new Error("Doctor Not Found");
  }

  if (doctor.isDeleted) {
    throw new Error("Doctor is already deleted");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
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
        id: doctor.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    await tx.session.deleteMany({
      where: {
        id: doctor.userId,
      },
    });

    await tx.doctorSpecialty.deleteMany({
      where: {
        doctorId: id,
      },
    });
  });

  return { message: "Deleted Successful" };
};

export const doctorService = {
  getAllDoctor,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
