import { type Server } from 'miragejs';
import { immutableRoomState } from './immutableRoomState';
import { mutableRoomState } from './mutableRoomState';
import { checkUserId } from './checkUserId';
import { checkRoomId } from './checkRoomId';

export const GET = function (serverThis: Server) {
  checkUserId.call(serverThis);
  immutableRoomState.call(serverThis);
  mutableRoomState.call(serverThis);
  checkRoomId.call(serverThis);
};
