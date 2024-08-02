import { type Server } from 'miragejs';
import { immutableRoomState } from './immutableRoomState';
import { mutableRoomState } from './mutableRoomState';
import { checkUserId } from './checkUserId';

export const GET = function (serverThis: Server) {
  checkUserId.call(serverThis);
  immutableRoomState.call(serverThis);
  mutableRoomState.call(serverThis);
};
