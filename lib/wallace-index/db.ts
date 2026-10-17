import { PrismaClient } from "@prisma/client";
const globalDb = globalThis as unknown as { wallaceDb?: PrismaClient };
export const db = globalDb.wallaceDb ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalDb.wallaceDb = db;
