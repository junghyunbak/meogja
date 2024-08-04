import { type Server } from 'miragejs';
import { updateUserName } from './updateUserName';
import { updateUserSelect } from './updateUserSelect';
import { updateUserPicky } from './updateUserPicky';

export const PATCH = (serverThis: Server) => {
  updateUserName.call(serverThis);
  updateUserSelect.call(serverThis);
  updateUserPicky.call(serverThis);
};
