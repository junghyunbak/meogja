import { type Server, Response } from 'miragejs';

export function immutableRoomState(this: Server) {
  this.get('/api/immutable-room-state', (schema, request) => {
    const {
      queryParams: { roomId },
    } = request;

    if (typeof roomId !== 'string') {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    const { lat, lng, restaurants, capacity, radius, endTime } = state;

    const responseData: ImmutableRoomInfo = {
      lat,
      lng,
      restaurants,
      capacity,
      radius,
      endTime,
    };

    return new Response(200, {}, { data: responseData });
  });
}
