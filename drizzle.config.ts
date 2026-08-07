import { type Config } from "drizzle-kit";

// import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "turso",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
    authToken: process.env.AUTH_TOKEN,
  },
  tablesFilter: ["admin-kacamatakoe_*"],
} satisfies Config;
