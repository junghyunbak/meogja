import { type Server, Response } from 'miragejs';

export function updateUserName(this: Server) {
  this.patch('/api/update-username', (schema, request) => {
    const { requestBody } = request;

    const { roomId, userId, newName } = JSON.parse(requestBody);

    /**
     * 전달받은 데이터가 올바르지 않을 경우 400(Bad Request) 응답
     */
    if (!roomId || !userId || !newName) {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    /**
     * 존재하지 않는 아이디일 경우 400(Bad Request) 응답
     */
    if (!state.user[userId]) {
      return new Response(400);
    }

    const newUserInfo = { ...state.user[userId] };

    newUserInfo.userName = newName;

    const newUser = { ...state.user };

    newUser[userId] = newUserInfo;

    const newState: RoomInfo = { ...state, user: newUser };

    schema.db[roomId].update(newState);

    return new Response(204);
  });
}
