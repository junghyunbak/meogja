import { type Server } from 'miragejs';
import { createRoom } from './createRoom';
import { joinRoom } from './joinRoom';

export const POST = function (serverThis: Server) {
  joinRoom.call(serverThis);
  createRoom.call(serverThis);
};
