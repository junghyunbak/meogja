import { type Server, Response } from 'miragejs';

export function updateUserLatLng(this: Server) {
  this.patch('/api/update-user-lat-lng', (schema, request) => {
    const { requestBody } = request;

    const { roomId, userId, lat, lng, direction } = JSON.parse(requestBody);

    if (
      !roomId ||
      !userId ||
      typeof lat !== 'number' ||
      typeof lng !== 'number' ||
      !(direction === 0 || direction === 1) ||
      // [ ]: 다른 곳에도 roomId가 없는 경우에 대한 예외처리를 해야한다.
      !schema.db[roomId]
    ) {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    if (!state.user[userId]) {
      return new Response(400);
    }

    const newState = JSON.parse(JSON.stringify(state)) as RoomInfo;

    newState.user[userId].lat = lat;
    newState.user[userId].lng = lng;
    newState.user[userId].direction = direction;

    schema.db[roomId].update(newState);

    return new Response(204);
  });
}
