import { PrismaClient } from "@prisma/client";

// One client for the whole app. In dev, hot reload re-runs this module, so the instance is parked on globalThis.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
