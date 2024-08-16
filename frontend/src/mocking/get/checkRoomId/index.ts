import { type Server, Response } from 'miragejs';
import { createResponseData } from '@/utils';
import { RESPONSE_CODE } from '@/constants/api';
import httpStatus from 'http-status';

export function checkRoomId(this: Server) {
  this.get('/api/check-room', (schema, request) => {
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

    return new Response(
      httpStatus.OK,
      {},
      createResponseData({}, RESPONSE_CODE.OK, '방 아이디 유효성 검사가 통과하였습니다.')
    );
  });
}
