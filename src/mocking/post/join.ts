import { NICKNAME_ADJECTIVE, NICKNAME_NOUN } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
import { type Server, Response } from 'miragejs';

export const join = function (this: Server) {
  this.post('/api/join', (schema, request) => {
    const { requestBody } = request;

    const { roomId } = JSON.parse(requestBody);

    const state = schema.db[roomId][0] as RoomInfo;

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

    return new Response(201, {}, { data: { id } });
  });
};
