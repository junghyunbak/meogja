import { type Server } from 'miragejs';
import { chkUserId } from './chkUserId';
import { state } from './state';
import { immutableRoomState } from './immutableRoomState';
import { mutableRoomState } from './mutableRoomState';

export const GET = function (serverThis: Server) {
  chkUserId.call(serverThis);
  state.call(serverThis);
  immutableRoomState.call(serverThis);
  mutableRoomState.call(serverThis);
};
