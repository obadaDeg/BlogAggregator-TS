import { defineConfig } from "drizzle-kit";
import { readConfig } from "./src/config";


const cfg = readConfig();

export default defineConfig({
  schema: "src/lib/db/schema.ts",
  out: "migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: cfg.dbUrl,
  },
});