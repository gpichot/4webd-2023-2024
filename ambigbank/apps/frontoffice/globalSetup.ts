import cp from 'child_process';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const logger = {
  info: console.log,
};

export default async function startDatabase() {
  const dbUri = process.env.DATABASE_URL;
  if (!dbUri) {
    throw new Error('DATABASE_URL is not set');
  }

  logger.info(`Using database ${dbUri}`);

  // Rewrite seed.sql using `npx prisma migrate diff --from-empty
  // --to-schema-datasource prisma/schema.prisma --script > test/seed.sql`
  // TODO: don't rewrite it too often
  // logger.info('Rewriting seed.sql');
  // cp.execSync(`mkdir -p test`);
  // try {
  //   cp.execSync(
  //     `sh ./node_modules/.bin/prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > test/seed.sql`,
  //   );
  // } catch (e) {
  //   console.log(e.message);
  // }

  // TODO: Use restricted roles to mimic what is production
  // if (!isCI) {
  //   logger.info(`Dropping and recreating database`);
  //   cp.execSync(
  //     `rm -rf ${DATABASE_URL}`,
  //   );
  //   cp.execSync(`createdb -O ${dbUser} ${dbName} -h ${dbHost} -p ${dbPort}`);
  // }
  // logger.info(`Seeding ${dbName} database with schema`);
  // cp.execSync(
  //   `psql -U ${dbUser} -d ${dbName} -f test/seed.sql -h ${dbHost} -p ${dbPort}`,
  // );
  cp.execSync(`./node_modules/.bin/prisma db push --force-reset`);

  return () => {
    // pass
  };
}
