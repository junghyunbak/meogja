import { useContext } from 'react';

import { UserMarker } from '@/components/naverMap/overlay/marker';

import { MapContext } from '../..';

import { useStore } from 'zustand';

import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

export const MapUserMarkers = () => {
  const { map } = useContext(MapContext);

  const mutableRoomInfoStore = useContext(MutableRoomInfoStoreContext);

  const [user] = useStore(mutableRoomInfoStore, (s) => [s.user]);

  return (
    <>
      {Object.entries(user).map(([userId, userData]) => {
        const { lat, lng, direction, userName } = userData;

        return (
          <UserMarker key={userId} map={map} lat={lat || 0} lng={lng || 0} direction={direction} userName={userName} />
        );
      })}
    </>
  );
};
