/* eslint-disable no-var */
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Extend the global type to include the `prisma` property
declare global {
  // Extend globalThis with the prisma property
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
