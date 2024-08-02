import { NICKNAME_ADJECTIVE, NICKNAME_NOUN } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { type Server, Response } from 'miragejs';

export const joinRoom = function (this: Server) {
  this.post('/api/join-room', (schema, request) => {
    const { requestBody } = request;

    const { roomId } = JSON.parse(requestBody);

    /**
     * 정보가 올바르지 않을 경우 400(bad request) 반환
     */
    if (!roomId) {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    /**
     * 방 수용인원 초과 시 403(forbidden) 반환
     */
    if (Object.keys(state.user).length === state.capacity) {
      return new Response(403);
    }

    const id = uuidv4();

    const nickName =
      NICKNAME_ADJECTIVE[
        Math.floor(Math.random() * NICKNAME_ADJECTIVE.length)
      ] +
      ' ' +
      NICKNAME_NOUN[Math.floor(Math.random() * NICKNAME_NOUN.length)];

    const newUser: User = {
      ...state.user,
    };

    newUser[id] = nickName;

    const newState: RoomInfo = {
      ...state,
      user: newUser,
    };

    schema.db[roomId].update(newState);

    /**
     * 성공적으로 방 입장 시 201 반환
     */
    return new Response(201, {}, { data: { id } });
  });
};
