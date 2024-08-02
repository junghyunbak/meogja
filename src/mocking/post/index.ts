import { type Server } from 'miragejs';
import { join } from './join';
import { createRoom } from './createRoom';

export const POST = function (serverThis: Server) {
  join.call(serverThis);
  createRoom.call(serverThis);
};
