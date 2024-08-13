import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { createCacheStoreKey } from './utils/response';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { NICKNAME_ADJECTIVE } from './constants/nickname';
import { RIGHT } from './constants/room';
import { ForbiddenException } from './exceptions/forbidden.exception';
import { BadRequestException } from './exceptions/badRequest.exception';
import { UnauthorizedException } from './exceptions/unauthorized.exception';

@Injectable()
export class AppService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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

    await this.cacheManager.store.set<ImmutableRoomInfo>(
      createCacheStoreKey(roomId, 'immutable'),
      { ...immutableRoomInfo, restaurants },
    );

    await this.cacheManager.store.set<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
      { user: {} },
    );

    return roomId;
  }

  async checkRoomIsExist(roomId: RoomId): Promise<void> {
    const mutableRoomInfo = await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );

    const immutableRoomInfo =
      await this.cacheManager.store.get<ImmutableRoomInfo>(
        createCacheStoreKey(roomId, 'immutable'),
      );

    if (!mutableRoomInfo || !immutableRoomInfo) {
      throw new BadRequestException();
    }
  }

  async checkRoomIsFull(roomId: RoomId): Promise<void> {
    const mutableRoomInfo = await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );

    const immutableRoomInfo =
      await this.cacheManager.store.get<ImmutableRoomInfo>(
        createCacheStoreKey(roomId, 'immutable'),
      );

    if (
      Object.keys(mutableRoomInfo.user).length === immutableRoomInfo.capacity
    ) {
      throw new ForbiddenException();
    }
  }

  async checkUserInRoom(roomId: RoomId, userId: UserId) {
    const mutableRoomInfo = await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );

    if (!Object.keys(mutableRoomInfo.user).includes(userId)) {
      throw new UnauthorizedException();
    }
  }

  async updateUserLatLng(
    roomId: RoomId,
    userId: UserId,
    lat: number,
    lng: number,
    direction: LEFT | RIGHT,
  ): Promise<void> {
    const mutableRoomInfo = await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );

    const userData = mutableRoomInfo.user[userId];

    mutableRoomInfo.user[userId] = { ...userData, lat, lng, direction };

    this.cacheManager.store.set<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
      mutableRoomInfo,
    );
  }

  async addUser(roomId: RoomId): Promise<UserId> {
    const mutableRoomInfo = await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );

    const userId = uuidv4();

    mutableRoomInfo.user[userId] = {
      userName: `${NICKNAME_ADJECTIVE[Math.floor(Math.random() * NICKNAME_ADJECTIVE.length)]} 비둘기`,
      lat: null,
      lng: null,
      direction: RIGHT,
      select: [],
    };

    await this.cacheManager.store.set<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
      mutableRoomInfo,
    );

    return userId;
  }

  async getImmutableRoomState(roomId: RoomId): Promise<ImmutableRoomInfo> {
    return await this.cacheManager.store.get<ImmutableRoomInfo>(
      createCacheStoreKey(roomId, 'immutable'),
    );
  }

  async getMutableRoomState(roomId: RoomId): Promise<MutableRoomInfo> {
    return await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );
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
