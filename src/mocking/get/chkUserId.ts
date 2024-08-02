import { type Server, Response } from 'miragejs';

export const chkUserId = function (this: Server) {
  this.get('/api/chk-user-id', (schema, request) => {
    const {
      queryParams: { userId, roomId },
    } = request;

    if (!userId || userId instanceof Array || typeof roomId !== 'string') {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    if (!Object.keys(state.user).includes(userId)) {
      return new Response(400);
    }

    return new Response(200);
  });
};
