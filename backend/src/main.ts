import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { BasicExceptionFilter } from './filters/basicExecption.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalFilters(new BasicExceptionFilter());

  await app.listen(3002);
}

bootstrap();
