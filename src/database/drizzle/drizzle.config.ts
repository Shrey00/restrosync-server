import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: "src/database/drizzle/schema/*.ts",
    dialect: "postgresql",
    out: "src/database/drizzle/migrations",
    dbCredentials: {
        url: process.env.DB_URL as string,
    },
});