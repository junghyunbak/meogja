import { type Server, Response } from 'miragejs';
import httpStatus from 'http-status';
import { createResponseData } from '@/utils';
import { RESPONSE_CODE } from '@/constants/api';

export function updateUserName(this: Server) {
  this.patch('/api/update-username', (schema, request) => {
    const { requestBody } = request;

    const { roomId, userId, newName } = JSON.parse(requestBody);

    if (typeof roomId !== 'string' || typeof userId !== 'string' || typeof newName !== 'string') {
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

    newState.user[userId].userName = newName;

    schema.db[roomId].update(newState);

    return new Response(httpStatus.NO_CONTENT);
  });
}
