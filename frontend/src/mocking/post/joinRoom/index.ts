import { NICKNAME_ADJECTIVE, RIGHT } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { type Server, Response } from 'miragejs';
import httpStatus from 'http-status';
import { createResponseData } from '@/utils';
import { RESPONSE_CODE } from '@/constants/api';

export const joinRoom = function (this: Server) {
  this.post('/api/join-room', (schema, request) => {
    const { requestBody } = request;

    const { roomId } = JSON.parse(requestBody);

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

    if (Object.keys(state.user).length === state.capacity) {
      return new Response(
        httpStatus.FORBIDDEN,
        {},
        createResponseData({}, RESPONSE_CODE.NO_EMTPY_SPACE, '방 접속인원이 가득 찼습니다.')
      );
    }

    const userId = uuidv4();

    const nickName = `${NICKNAME_ADJECTIVE[Math.floor(Math.random() * NICKNAME_ADJECTIVE.length)]} 비둘기`;

    const newState = JSON.parse(JSON.stringify(state)) as RoomInfo;

    newState.user[userId] = {
      userName: nickName,
      select: [],
      lat: null,
      lng: null,
      direction: RIGHT,
      gpsLat: null,
      gpsLng: null,
    };

    schema.db[roomId].update(newState);

    return new Response(
      httpStatus.CREATED,
      {},
      createResponseData<{ userId: UserId }>({ userId }, RESPONSE_CODE.OK, '방에 성공적으로 입장하였습니다.')
    );
  });
};
