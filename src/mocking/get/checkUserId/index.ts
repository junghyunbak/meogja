import { type Server, Response } from 'miragejs';

export const checkUserId = function (this: Server) {
  this.get('/api/check-user-id', (schema, request) => {
    const {
      queryParams: { userId, roomId },
    } = request;

    /**
     * 정보가 올바르지 않을 경우 400(bad request) 반환
     */
    if (!userId || userId instanceof Array || typeof roomId !== 'string') {
      return new Response(400);
    }

    const state = schema.db[roomId][0] as RoomInfo;

    /**
     * 사용자의 식별자가 방에 존재하지 않을 경우 401(unauthorized) 반환
     */
    if (!Object.keys(state.user).includes(userId)) {
      return new Response(401);
    }

    /**
     * 유효성 검사를 통과할 경우 200(ok) 반환
     */
    return new Response(200);
  });
};
