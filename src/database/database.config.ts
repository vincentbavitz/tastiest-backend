import { registerAs } from '@nestjs/config';
import { join } from 'path';

/**
 * Solution to access config in NestJS and TypeORM CLI.
 * https://stackoverflow.com/questions/59913475/configure-typeorm-with-one-configuration-for-cli-and-nestjs-application
 */
export default registerAs('database', () => {
  const synchronize = process.env.TYPEORM_SYNCHRONIZE === 'true';

  const config = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    synchronize,
    // dropSchema: synchronize,
    autoLoadEntities: true,
    migrations: ['dist/database/migrations/*.js'],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
  };

  console.log('config', config);

  return config;
});
