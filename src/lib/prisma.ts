/**
 * Prisma Client Singleton
 * Prevents multiple PrismaClient instances in Next.js dev mode hot-reloads
 */
import { PrismaClient } from "../generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  (() => {
    const connectionString = process.env.DATABASE_URL;
    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter } as unknown as ConstructorParameters<typeof PrismaClient>[0]);
  })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
