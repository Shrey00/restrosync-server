import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: "./schema/*.ts",
    dialect: "postgresql",
    out: "./migrations",
    dbCredentials: {
        url: process.env.DB_URL as string,
    },
});