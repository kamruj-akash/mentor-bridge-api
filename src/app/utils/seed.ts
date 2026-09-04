import bcrypt from "bcryptjs";
import { Role } from "../../../prisma/src/generated/prisma/enums";
import envConfig from "../config/env";
import { prisma } from "../lib/prisma";

const password = await bcrypt.hash(
  "123456",
  Number(envConfig.bcrypt_salt_rounds),
);
export const seedData = async () => {
  try {
    const admin = await prisma.user.findFirst({
      where: { role: Role.ADMIN },
    });
    const student = await prisma.user.findFirst({
      where: { role: Role.STUDENT },
    });
    const expert = await prisma.user.findFirst({
      where: { role: Role.EXPERT },
    });

    if (!admin) {
      await prisma.user.create({
        data: {
          name: "Admin User",
          email: "admin@gmail.com",
          password,
          role: Role.ADMIN,
        },
      });
      console.log("Admin user created successfully.");
    }

    if (!student) {
      await prisma.user.create({
        data: {
          name: "Student User",
          email: "student@gmail.com",
          password,
          role: Role.STUDENT,
          student: {
            create: {
              academicLevel: "Undergraduate",
              institution: "University of Example",
            },
          },
        },
      });
      console.log("Student user created successfully.");
    }
    if (!expert) {
      await prisma.user.create({
        data: {
          name: "Expert User",
          email: "expert@gmail.com",
          password,
          role: Role.EXPERT,
          expert: {
            create: {
              documents: [
                {
                  secure_url:
                    "https://res.cloudinary.com/dxjv0gq3k/image/upload/v1697061870/assignment-attachments/assignment-documents",
                  publicId: "assignment-documents",
                },
              ],
              department: "Computer Science",
              university: "University of Example",
              ratePerAssignment: 100,
              bio: "I am an experienced expert in my field, ready to assist students with their assignments.",
            },
          },
        },
      });
      console.log("Expert user created successfully.");
    }
  } catch (error) {
    console.error("Error seeding data:", error);
  }
};
