import { type Server, Response } from 'miragejs';

export function updateUserSelect(this: Server) {
  this.patch('/api/update-user-select', (schema, request) => {
    const { requestBody } = request;
    const { userId, roomId, restaurantId } = JSON.parse(requestBody);

    if (!userId || !roomId || !restaurantId) {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    if (!state.user[userId]) {
      return new Response(400);
    }

    const newUserInfo = { ...state.user[userId] };

    const select = [...newUserInfo.select];

    const idx = select.indexOf(restaurantId);

    if (idx === -1) {
      select.push(restaurantId);
    } else {
      select.splice(idx, 1);
    }

    newUserInfo.select = select;

    const newUser = { ...state.user };

    newUser[userId] = newUserInfo;

    const newState: RoomInfo = { ...state, user: newUser };

    schema.db[roomId].update(newState);

    return new Response(204);
  });
}
