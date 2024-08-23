import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { redisProvider } from './configs/redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        KAKAO_REST_API_KEY: Joi.string().required(),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...redisProvider],
})
export class AppModule {}
