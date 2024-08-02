import { type Server, Response } from 'miragejs';

export function mutableRoomState(this: Server) {
  this.get('/api/mutable-room-state', (schema, request) => {
    const {
      queryParams: { roomId },
    } = request;

    if (typeof roomId !== 'string') {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    const { chats, select, user, picky } = state;

    const responseData: MutableRoomInfo = {
      chats,
      select,
      user,
      picky,
    };

    return new Response(200, {}, { data: responseData });
  });
}
