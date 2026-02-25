import { Gender, Role } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
  };
  specialties: string[];
}

export interface ICreateAdmin {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePhoto?: string | undefined;
    description?: string | undefined;
    contactNumber?: string | undefined;
    role: Role;
  };
}

export interface ICreateSuperAdmin {
  password: string;
  superAdmin: {
    name: string;
    email: string;
    profilePhoto?: string | undefined;
    description?: string;
    contactNumber?: string;
    role: Role;
  };
}
