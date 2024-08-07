import { type Server, Response } from 'miragejs';

export function checkRoomId(this: Server) {
  this.get('/api/check-room', (schema, request) => {
    const {
      queryParams: { roomId },
    } = request;

    if (typeof roomId !== 'string' || !schema.db[roomId]) {
      return new Response(400);
    }

    return new Response(204);
  });
}
