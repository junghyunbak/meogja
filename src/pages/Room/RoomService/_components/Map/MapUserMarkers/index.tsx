import { useContext } from 'react';

import { IdentifierContext } from '@/pages/Room';

import useStore from '@/store';

import { UserMarker } from '@/components/naverMap/overlay/marker';

export function MapUserMarkers() {
  const { userId } = useContext(IdentifierContext);

  const [map] = useStore((state) => [state.map]);
  const [user] = useStore((state) => [state.user]);
  const [myMapLatLng] = useStore((state) => [state.myMapLatLng]);

  const me = user[userId];

  return (
    <>
      {me && <UserMarker userData={{ ...me, ...myMapLatLng }} map={map} />}

      {Object.keys(user)
        .filter((id) => id !== userId)
        .map((otherUserId) => {
          return <UserMarker userData={user[otherUserId]} key={userId} map={map} />;
        })}
    </>
  );
}
