import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { redisOptions } from './configs/redis';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        REDIS_HOST: Joi.string().default('localhost'),
        REDIS_PORT: Joi.number().default(6379),
        KAKAO_REST_API_KEY: Joi.string(),
      }),
    }),
    CacheModule.registerAsync(redisOptions),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
