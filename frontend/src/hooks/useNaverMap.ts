import { useEffect, useState, useRef } from 'react';

export function useNaverMap({ lat, lng, zoom = 14 }: { lat: number; lng: number; zoom?: number }) {
  const mapRef = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return;
    }

    const map = new naver.maps.Map(mapRef.current, {
      center: new naver.maps.LatLng(lat, lng),
      zoom,
    });

    setMap(map);
  }, []);

  return { map, mapRef };
}
