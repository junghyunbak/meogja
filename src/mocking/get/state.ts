import { type Server, Response } from 'miragejs';

export const state = function (this: Server) {
  this.get('/api/state', (schema, request) => {
    const {
      queryParams: { roomId },
    } = request;

    /**
     * 정보가 올바르지 않을 경우 400(bad request) 반환
     */
    if (typeof roomId !== 'string') {
      return new Response(400);
    }

    const state = schema.db[roomId][0];

    /**
     * 정보가 올바를 경우 응답 결과와 함께 200(ok) 반환
     */
    return new Response(200, {}, { data: state });
  });
};
