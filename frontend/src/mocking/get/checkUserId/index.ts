import { type Server, Response } from 'miragejs';
import { RESPONSE_CODE } from '@/constants/api';
import { createResponseData } from '@/utils';
import httpStatus from 'http-status';

export const checkUserId = function (this: Server) {
  this.get('/api/check-user-id', (schema, request) => {
    const {
      queryParams: { userId, roomId },
    } = request;

    if (typeof userId !== 'string' || typeof roomId !== 'string') {
      return new Response(
        httpStatus.BAD_REQUEST,
        {},
        createResponseData({}, RESPONSE_CODE.BAD_REQUEST, '잘못된 요청입니다.')
      );
    }

    if (!schema.db[roomId]) {
      return new Response(
        httpStatus.BAD_GATEWAY,
        {},
        createResponseData({}, RESPONSE_CODE.BAD_ROOM, '존재하지 않는 방입니다.')
      );
    }

    const state = schema.db[roomId][0] as RoomInfo;

    if (!Object.keys(state.user).includes(userId)) {
      return new Response(
        httpStatus.UNAUTHORIZED,
        {},
        createResponseData({}, RESPONSE_CODE.NOT_AUTHORITY, '방에 속하지 않은 사용자의 접속입니다.')
      );
    }

    return new Response(
      httpStatus.OK,
      {},
      createResponseData({}, RESPONSE_CODE.OK, '사용자 아이디 유효성 검사가 통과하였습니다.')
    );
  });
};
