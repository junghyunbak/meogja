import { RESPONSE_CODE } from '@/constants/api';
import { createResponseData } from '@/utils';
import httpStatus from 'http-status';
import { type Server, Response } from 'miragejs';

export function immutableRoomState(this: Server) {
  this.get('/api/immutable-room-state', (schema, request) => {
    const {
      queryParams: { roomId },
    } = request;

    if (typeof roomId !== 'string') {
      return new Response(
        httpStatus.BAD_REQUEST,
        {},
        createResponseData({}, RESPONSE_CODE.BAD_REQUEST, '잘못된 요청입니다.')
      );
    }

    if (!schema.db[roomId]) {
      return new Response(
        httpStatus.BAD_REQUEST,
        {},
        createResponseData({}, RESPONSE_CODE.BAD_ROOM, '존재하지 않는 방입니다.')
      );
    }

    const state = schema.db[roomId][0] as RoomInfo;

    const { lat, lng, restaurants, capacity, radius, endTime, maxPickCount } = state;

    const responseData: ImmutableRoomInfo = {
      lat,
      lng,
      restaurants,
      capacity,
      radius,
      endTime,
      maxPickCount,
    };

    return new Response(
      httpStatus.OK,
      {},
      createResponseData<ImmutableRoomInfo>(responseData, RESPONSE_CODE.OK, '성공적으로 데이터를 로드했습니다.')
    );
  });
}
