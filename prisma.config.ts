import { defineConfig } from "@prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  // Client generation does not require a live database.
  ...(process.env.DIRECT_URL ? { datasource: { url: process.env.DIRECT_URL } } : {}),
});
