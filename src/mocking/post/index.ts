import { type Server } from 'miragejs';
import { join } from './join';

export const POST = function (serverThis: Server) {
  join.call(serverThis);
};
