import { registerAs } from '@nestjs/config';

/**
 * Solution to access config in NestJS and TypeORM CLI.
 * https://stackoverflow.com/questions/59913475/configure-typeorm-with-one-configuration-for-cli-and-nestjs-application
 */
export default registerAs('database', () => {
  return {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ['dist/entities/**/*.entity{.ts,.js}'],
    synchronize: process.env.TYPEORM_SYNCHRONIZE,
    autoLoadEntities: true,
    migrations: ['dist/database/migrations/*.js'],
    cli: {
      migrationsDir: 'src/database/migrations',
    },
  };
});
