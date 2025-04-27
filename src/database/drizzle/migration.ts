import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';

const migrationClient = postgres(process.env.DB_URL as string, { max: 1 });

(async () => {
    await migrate(drizzle(migrationClient), {
        migrationsFolder: 'src/database/drizzle/migrations'
    });
    await migrationClient.end();
})();