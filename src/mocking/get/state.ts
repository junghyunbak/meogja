import { type Server, Response } from 'miragejs';

export const state = function (this: Server) {
  this.get('/api/state', (schema) => {
    const state = schema.db.room[0];

    return new Response(200, {}, state);
  });
};
