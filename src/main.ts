import { ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationException } from './filters/validation.exception';
import { ValidationFilter } from './filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validation filter
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      skipMissingProperties: false,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors.map((error) => {
          return {
            error: `${error.property} has wrong value ${error.value}.`,
            message: Object.values(error.constraints).join(''),
          };
        });

        return new ValidationException(messages);
      },
    }),
  );

  await app.listen(4444);
}

bootstrap();
