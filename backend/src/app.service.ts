import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { createCacheStoreKey } from './utils/response';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

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

    return roomId;
  }

  async getRestaurants(
    lat: number,
    lng: number,
    category: Category,
    radius: number,
  ): Promise<Restaurant[]> {
    const restaurants: Restaurant[] = [];

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
