import { type Server } from 'miragejs';
import { updateUserName } from './updateUserName';
import { updateUserSelect } from './updateUserSelect';
import { updateUserLatLng } from './updateUserLatLng';
import { updateUserGpsLatLng } from './updateUserGpsLatLng';

export const PATCH = (serverThis: Server) => {
  updateUserName.call(serverThis);
  updateUserSelect.call(serverThis);
  updateUserLatLng.call(serverThis);
  updateUserGpsLatLng.call(serverThis);
};
