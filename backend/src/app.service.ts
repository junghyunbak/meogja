import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { v4 as uuidv4 } from 'uuid';

import { CreateRoomDto } from './dto/create-room.dto';

import axios from 'axios';

import { NICKNAME_ADJECTIVE } from './constants/nickname';
import { RIGHT } from './constants/room';

import { UnauthorizedException } from './exceptions/unauthorized.exception';
import { ForbiddenException } from './exceptions/forbidden.exception';
import {
  BadRequestException,
  BadRoomException,
} from './exceptions/badRequest.exception';

import { RedisClientType } from 'redis';

import { createRedisStoreKey } from './utils/response';

@Injectable()
export class AppService {
  constructor(
    @Inject('REDIS_CLIENT') private redis: RedisClientType,
    private configService: ConfigService,
  ) {}

  createRoomId(): RoomId {
    return uuidv4();
  }

  async createRoom(immutableRoomInfo: CreateRoomDto): Promise<RoomId> {
    const roomId = this.createRoomId();

    const restaurants: Restaurant[] = await this.getRestaurants(
      immutableRoomInfo.lat,
      immutableRoomInfo.lng,
      immutableRoomInfo.category,
      immutableRoomInfo.radius,
    );

    await this.redis.json.set(createRedisStoreKey(roomId, 'immutable'), '$', {
      ...immutableRoomInfo,
      restaurants,
    });

    await this.redis.json.set(createRedisStoreKey(roomId, 'mutable'), '$', {
      user: {},
    });

    return roomId;
  }

  async checkRoomIsExist(roomId: RoomId): Promise<void> {
    const mutableRoomInfo = await this.redis.json.get(
      createRedisStoreKey(roomId, 'mutable'),
    );

    const immutableRoomInfo = await this.redis.json.get(
      createRedisStoreKey(roomId, 'immutable'),
    );

    if (!mutableRoomInfo || !immutableRoomInfo) {
      throw new BadRoomException();
    }
  }

  async joinRoom(roomId: RoomId): Promise<UserId> {
    const joinListKey = createRedisStoreKey(roomId, 'joinList');

    const userId = uuidv4();

    const userData = {
      userName: `${NICKNAME_ADJECTIVE[Math.floor(Math.random() * NICKNAME_ADJECTIVE.length)]} 비둘기`,
      lat: null,
      lng: null,
      direction: RIGHT,
      select: [],
      gpsLat: null,
      gpsLng: null,
    };

    let retryCount = 10;

    let isSuccess = false;

    while (retryCount--) {
      await this.redis.watch(joinListKey);

      const immutableRoomInfo = (await this.redis.json.get(
        createRedisStoreKey(roomId, 'immutable'),
      )) as ImmutableRoomInfo;

      const count = await this.redis.sCard(joinListKey);

      if (count === immutableRoomInfo.capacity) {
        throw new ForbiddenException();
      }

      const multi = this.redis
        .multi()
        .sAdd(createRedisStoreKey(roomId, 'joinList'), userId)
        .json.set(
          createRedisStoreKey(roomId, 'mutable'),
          `$.user.${userId}`,
          userData,
        );

      const result = await multi.exec();

      /**
       * 트랜잭션이 실패한 경우
       */
      if (result === null) {
        continue;
      }

      isSuccess = true;

      await this.redis.unwatch();

      break;
    }

    if (!isSuccess) {
      throw new ForbiddenException();
    }

    return userId;
  }

  async checkUserInRoom(roomId: RoomId, userId: UserId) {
    if (
      !(await this.redis.sIsMember(
        createRedisStoreKey(roomId, 'joinList'),
        userId,
      ))
    ) {
      throw new UnauthorizedException();
    }
  }

  async getImmutableRoomState(roomId: RoomId) {
    return (await this.redis.json.get(
      createRedisStoreKey(roomId, 'immutable'),
    )) as ImmutableRoomInfo;
  }

  async getMutableRoomState(roomId: RoomId) {
    return (await this.redis.json.get(
      createRedisStoreKey(roomId, 'mutable'),
    )) as MutableRoomInfo;
  }

  async updateUserLatLng(
    roomId: RoomId,
    userId: UserId,
    lat: number,
    lng: number,
    direction: LEFT | RIGHT,
  ): Promise<void> {
    await this.redis.json.mSet([
      {
        key: createRedisStoreKey(roomId, 'mutable'),
        path: `$.user.${userId}.lat`,
        value: lat,
      },
      {
        key: createRedisStoreKey(roomId, 'mutable'),
        path: `$.user.${userId}.lng`,
        value: lng,
      },
      {
        key: createRedisStoreKey(roomId, 'mutable'),
        path: `$.user.${userId}.direction`,
        value: direction,
      },
    ]);
  }

  async updateUserGpsLatLng(
    roomId: RoomId,
    userId: UserId,
    lat: number,
    lng: number,
  ): Promise<void> {
    await this.redis.json.mSet([
      {
        key: createRedisStoreKey(roomId, 'mutable'),
        path: `$.user.${userId}.gpsLat`,
        value: lat,
      },
      {
        key: createRedisStoreKey(roomId, 'mutable'),
        path: `$.user.${userId}.gpsLng`,
        value: lng,
      },
    ]);
  }

  async updateUserSelect(
    roomId: RoomId,
    userId: UserId,
    restaurantId: RestaurantId,
  ) {
    const luaScript = `
      local mutableKey = KEYS[1]
      local immutableKey = KEYS[2]
      local path = ARGV[1]
      local value = ARGV[2]

      local index = redis.call('JSON.ARRINDEX', mutableKey, path, value)[1]

      if index == -1 then
        local curSelectCount = redis.call('JSON.ARRLEN', mutableKey, path)[1]
        local maxSelectCount = redis.call('JSON.GET', immutableKey, '.maxPickCount')

        if curSelectCount >= tonumber(maxSelectCount) then
          return 'error'

        end

        redis.call('JSON.ARRAPPEND', mutableKey, path, value)
      
        return 'added'
      else
        redis.call('JSON.ARRPOP', mutableKey, path, index)
    
        return 'removed'

      end
    `;

    const result = await this.redis.eval(luaScript, {
      keys: [
        createRedisStoreKey(roomId, 'mutable'),
        createRedisStoreKey(roomId, 'immutable'),
      ],
      arguments: [
        `$.user.${userId}.select`,
        /**
         * 정수 형태로 저장되지 않게끔 쌍따옴표 추가
         */
        `"${restaurantId}"`,
      ],
    });

    if (result === 'error') {
      throw new BadRequestException();
    }
  }

  async getRestaurants(
    lat: number,
    lng: number,
    category: Category,
    radius: number,
  ): Promise<Restaurant[]> {
    const restaurants: Restaurant[] = [];

    let data: KakaoPlaceSearchWithCategoryResponse;

    let page = 1;

    do {
      data = await axios
        .get<KakaoPlaceSearchWithCategoryResponse>(
          'https://dapi.kakao.com/v2/local/search/category.json',
          {
            params: {
              category_group_code: category,
              y: lat,
              x: lng,
              radius: radius * 1000,
              page,
            },
            headers: {
              Authorization: `KakaoAK ${this.configService.get<string>('KAKAO_REST_API_KEY')}`,
            },
          },
        )
        .then((value) => value.data);

      data.documents.forEach((document) => {
        restaurants.push({
          id: document.id,
          name: document.place_name,
          lat: +document.y,
          lng: +document.x,
          placeUrl: document.place_url,
          categoryName: document.category_name,
        });
      });

      page++;
    } while (!data.meta.is_end);

    return restaurants;
  }
}
