import { type Server, Response } from 'miragejs';
import { createResponseData } from '@/utils';
import { RESPONSE_CODE } from '@/constants/api';
import httpStatus from 'http-status';
import { LEFT, RIGHT } from '@/constants';

export function updateUserLatLng(this: Server) {
  this.patch('/api/update-user-lat-lng', (schema, request) => {
    const { requestBody } = request;

    const { roomId, userId, lat, lng, direction } = JSON.parse(requestBody);

    if (
      typeof roomId !== 'string' ||
      typeof userId !== 'string' ||
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      !(direction === LEFT || direction === RIGHT)
    ) {
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

    if (!state.user[userId]) {
      return new Response(
        httpStatus.BAD_REQUEST,
        {},
        createResponseData({}, RESPONSE_CODE.NOT_AUTHORITY, '방에 접속중이지 않은 사용자의 요청입니다.')
      );
    }

    const newState = JSON.parse(JSON.stringify(state)) as RoomInfo;

    newState.user[userId].lat = lat;
    newState.user[userId].lng = lng;
    newState.user[userId].direction = direction;

    schema.db[roomId].update(newState);

    return new Response(httpStatus.NO_CONTENT);
  });
}
