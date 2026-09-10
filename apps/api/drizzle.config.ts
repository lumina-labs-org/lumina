import "dotenv/config"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  dialect: "postgresql",

  schema: "./src/shared/infrastructure/database/schemas/*.ts",

  out: "./drizzle",

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})