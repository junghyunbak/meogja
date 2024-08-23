import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from 'redis';

export const redisProvider: Provider[] = [
  {
    provide: 'REDIS_CLIENT',
    /**
     * https://stackoverflow.com/questions/64337784/nestjs-use-configservice-in-simple-provider-class
     */
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const host = configService.get<string>('REDIS_HOST');
      const port = configService.get<string>('REDIS_PORT');

      const client = createClient({
        url: `redis://${host}:${port}`,
      });

      await client.connect();

      return client;
    },
  },
];
