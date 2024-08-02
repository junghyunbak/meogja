import { type Server } from 'miragejs';
import { updateUserName } from './updateUserName';

export const PATCH = (serverThis: Server) => {
  updateUserName.call(serverThis);
};
