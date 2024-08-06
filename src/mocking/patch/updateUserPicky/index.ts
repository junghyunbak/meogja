import { type Server, Response } from 'miragejs';

export function updateUserPicky(this: Server) {
  this.patch('/api/update-user-picky', (schema, request) => {
    const { requestBody } = request;

    const { userId, roomId, restaurantId } = JSON.parse(requestBody);

    if (!userId || !roomId || !restaurantId) {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    if (!state.user[userId]) {
      return new Response(400);
    }

    const newState = JSON.parse(JSON.stringify(state)) as RoomInfo;

    const picky = newState.user[userId].picky;

    if (picky.includes(restaurantId)) {
      newState.user[userId].picky = picky.filter((v) => v !== restaurantId);
    } else {
      newState.user[userId].picky = [...picky, restaurantId];
    }

    schema.db[roomId].update(newState);

    return new Response(204);
  });
}
