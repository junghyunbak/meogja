import { type Server } from 'miragejs';
import { chkUserId } from './chkUserId';
import { state } from './state';

export const GET = function (serverThis: Server) {
  chkUserId.call(serverThis);
  state.call(serverThis);
};
