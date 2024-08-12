import { useEffect, useState } from 'react';

export function useNaverMap({
  lat,
  lng,
  mapId,
  zoom = 14,
}: {
  mapId: string;
  lat: number;
  lng: number;
  zoom?: number;
}) {
  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    const map = new naver.maps.Map(mapId, {
      center: new naver.maps.LatLng(lat, lng),
      zoom,
    });

    setMap(map);
  }, [setMap, lat, lng, mapId, zoom]);

  return { map };
}
