import { memo, useEffect, useRef, useContext } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';

export const Map = memo(() => {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const { lat, lng } = useContext(ImmutableRoomInfoContext);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new kakao.maps.Map(mapRef.current, {
      center: new kakao.maps.LatLng(lat, lng),
    });
  }, []);

  return <div className="flex-1" ref={mapRef} />;
});
