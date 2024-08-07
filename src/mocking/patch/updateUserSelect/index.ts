import { type Server, Response } from 'miragejs';
import httpStatus from 'http-status';
import { RESPONSE_CODE } from '@/constants/api';
import { createResponseData } from '@/utils';

export function updateUserSelect(this: Server) {
  this.patch('/api/update-user-select', (schema, request) => {
    const { requestBody } = request;

    const { userId, roomId, restaurantId } = JSON.parse(requestBody);

    if (typeof userId !== 'string' || typeof roomId !== 'string' || typeof restaurantId !== 'string') {
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

    const select = [...newState.user[userId].select];

    const idx = select.indexOf(restaurantId);

    if (idx === -1) {
      select.push(restaurantId);
    } else {
      select.splice(idx, 1);
    }

    newState.user[userId].select = select;

    schema.db[roomId].update(newState);

    return new Response(
      httpStatus.OK,
      {},
      createResponseData({}, RESPONSE_CODE.OK, '성공적으로 사용자 선택정보를 업데이트 했습니다.')
    );
  });
}
