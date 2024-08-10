import { useContext } from 'react';

import useStore from '@/store';

import { UserMarker } from '@/components/naverMap/overlay/marker';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';

export function MapUserMarkers() {
  const userId = useContext(UserIdContext);

  const [map] = useStore((state) => [state.map]);
  const [user] = useStore((state) => [state.user]);
  const [myMapLatLng] = useStore((state) => [state.myMapLatLng]);
  const [myDirection] = useStore((state) => [state.myDirection]);

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
}
