import { useEffect, useState } from 'react';

export function useNaverMap({
  lat,
  lng,
  mapId,
}: {
  mapId: string;
  lat: number;
  lng: number;
}) {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    const map = new naver.maps.Map(mapId, {
      center: new naver.maps.LatLng(lat, lng),
    });

    setMap(map);
  }, [setMap, lat, lng, mapId]);

  return { map };
}
