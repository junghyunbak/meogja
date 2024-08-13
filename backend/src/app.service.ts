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

  async checkRoomIsValid(roomId: string) {
    const mutableRoomInfo = await this.cacheManager.store.get<MutableRoomInfo>(
      createCacheStoreKey(roomId, 'mutable'),
    );

    const immutableRoomInfo =
      await this.cacheManager.store.get<ImmutableRoomInfo>(
        createCacheStoreKey(roomId, 'immutable'),
      );

    /**
     * 방이 존재하는지
     */
    if (!mutableRoomInfo || !immutableRoomInfo) {
      throw new BadRequestException();
    }

    /**
     * 방이 가득찼는지
     */
    if (
      Object.keys(mutableRoomInfo.user).length === immutableRoomInfo.capacity
    ) {
      throw new ForbiddenException();
    }

    return true;
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

  async getRestaurants(
    lat: number,
    lng: number,
    category: Category,
    radius: number,
  ): Promise<Restaurant[]> {
    const restaurants: Restaurant[] = [];

    // [ ]: 모든 페이지의 데이터까지 다 가져오도록 구현
    const { data } = await axios.get<KakaoPlaceSearchWithCategoryResponse>(
      'https://dapi.kakao.com/v2/local/search/category.json',
      {
        params: {
          category_group_code: category,
          y: lat,
          x: lng,
          radius: radius * 1000,
        },
        headers: {
          Authorization: `KakaoAK ${this.configService.get<string>('KAKAO_REST_API_KEY')}`,
        },
      },
    );

    data.documents.forEach((document) => {
      restaurants.push({
        id: document.id,
        name: document.place_name,
        lat: +document.y,
        lng: +document.x,
        placeUrl: document.place_url,
      });
    });

    return restaurants;
  }
}
