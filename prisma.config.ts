// Prisma 7 reads the connection URL from here, not from schema.prisma (a `url` there is error P1012).
// Prisma 7 also no longer loads .env by itself, so we load it with Node's built-in loader.
import { defineConfig, env } from "prisma/config";

process.loadEnvFile(".env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
