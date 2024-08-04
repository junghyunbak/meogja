import { type Server, Response } from 'miragejs';

const RESTAURANT_KIND: RestaurantKind[] = [
  'chicken',
  'chinese',
  'hamburger',
  'japan',
  'korean',
  'pizza',
  'western',
  'snack',
];

export function updateUserPicky(this: Server) {
  this.patch('/api/update-user-picky', (schema, request) => {
    const { requestBody } = request;

    const { userId, roomId, restaurantKind } = JSON.parse(requestBody);

    if (!userId || !roomId || !RESTAURANT_KIND.includes(restaurantKind)) {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    if (!state.user[userId]) {
      return new Response(400);
    }

    const newState = JSON.parse(JSON.stringify(state)) as RoomInfo;

    newState.user[userId].picky = !newState.user[userId].picky
      ? restaurantKind
      : null;

    schema.db[roomId].update(newState);

    return new Response(204);
  });
}
