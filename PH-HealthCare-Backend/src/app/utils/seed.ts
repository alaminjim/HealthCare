import { Role } from "../../generated/prisma/enums";
import { envConfig } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const superAdmin = async () => {
  try {
    const isExists = await prisma.user.findFirst({
      where: {
        role: Role.SUPER_ADMIN,
      },
    });

    if (isExists) {
      console.log("Super admin already exists");
      return;
    }

    const superAdminData = await auth.api.signUpEmail({
      body: {
        email: envConfig.SUPER_ADMIN_EMAIL,
        password: envConfig.SUPER_ADMIN_PASSWORD,
        name: "Super Admin",
        role: Role.SUPER_ADMIN,
        needPasswordChange: false,
        rememberMe: false,
      },
    });

    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: superAdminData.user.id,
        },
        data: {
          emailVerified: true,
        },
      });

      await tx.admin.create({
        data: {
          userId: superAdminData.user.id,
          name: "Super Admin",
          email: envConfig.SUPER_ADMIN_EMAIL,
        },
      });
    });
    const superAdmin = await prisma.admin.findFirst({
      where: {
        email: envConfig.SUPER_ADMIN_EMAIL,
      },
      include: {
        user: true,
      },
    });

    console.log("Super Admin Created ", superAdmin);
  } catch (error) {
    console.error("Error seeding super admin: ", error);
  }
};
