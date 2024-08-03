import { type Server } from 'miragejs';
import { updateUserName } from './updateUserName';
import { updateUserSelect } from './updateUserSelect';

export const PATCH = (serverThis: Server) => {
  updateUserName.call(serverThis);
  updateUserSelect.call(serverThis);
};
