import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { type Cache } from 'cache-manager';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoomDto } from './dto/create-room.dto';
import { createCacheStoreKey } from './utils/response';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  createRoomId(): RoomId {
    return uuidv4();
  }

  async createRoom(immutableRoomInfo: CreateRoomDto): Promise<RoomId> {
    const roomId = this.createRoomId();

    const restaurants: Restaurant[] = [];

    await this.cacheManager.store.set<ImmutableRoomInfo>(
      createCacheStoreKey(roomId, 'immutable'),
      { ...immutableRoomInfo, restaurants },
    );

    return roomId;
  }

  async getRestaurants(): Promise<Restaurant[]> {
    const restaurants: Restaurant[] = [];

    return restaurants;
  }
}
