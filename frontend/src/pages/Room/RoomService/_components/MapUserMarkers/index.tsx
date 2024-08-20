import { memo, useContext } from 'react';

import useGlobalStore from '@/store';

import { UserMarker } from '@/components/naverMap/overlay/marker';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { MapContext } from '../..';
import { useStore } from 'zustand';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

export const MapUserMarkers = memo(() => {
  const userId = useContext(UserIdContext);

  const { map } = useContext(MapContext);

  const mutableRoomInfoStore = useContext(MutableRoomInfoStoreContext);

  const [user] = useStore(mutableRoomInfoStore, (s) => [s.user]);

  const [myMapLatLng] = useGlobalStore((state) => [state.myMapLatLng]);
  const [myDirection] = useGlobalStore((state) => [state.myDirection]);

  const me = user[userId];

  return (
    <>
      {me && <UserMarker userData={{ ...me, ...myMapLatLng, direction: myDirection }} map={map} />}

      {Object.keys(user)
        .filter((id) => id !== userId)
        .map((otherUserId) => {
          return <UserMarker userData={user[otherUserId]} key={otherUserId} map={map} />;
        })}
    </>
  );
});
