import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../prisma/src/generated/prisma/client";
import envConfig from "../config/env";

const connectionString = envConfig.database_url;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

// `bun --hot` re-evaluates modules on every change; without this the old
// client's connection pool is orphaned on each reload.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

if (envConfig.node_env !== "production") {
  globalForPrisma.prisma = prisma;
}

export { prisma };
