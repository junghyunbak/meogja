import { type Server } from 'miragejs';
import { updateUserName } from './updateUserName';
import { updateUserSelect } from './updateUserSelect';
import { updateUserPicky } from './updateUserPicky';
import { updateUserLatLng } from './updateUserLatLng';

export const PATCH = (serverThis: Server) => {
  updateUserName.call(serverThis);
  updateUserSelect.call(serverThis);
  updateUserPicky.call(serverThis);
  updateUserLatLng.call(serverThis);
};
