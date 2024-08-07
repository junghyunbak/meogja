import { useEffect } from 'react';

interface ActivityRadiusProps {
  map: naver.maps.Map | null;
  centerLatLng: naver.maps.LatLng;
  radius: number;
}

export function ActivityRadius({ map, centerLatLng, radius }: ActivityRadiusProps) {
  useEffect(() => {
    if (!map) {
      return;
    }

    const latMin = 28.7905313;
    const latMax = 44.4367236;
    const lngMin = 120.6472122;
    const lngMax = 133.830806;

    const ploygon = new naver.maps.Polygon({
      map,
      paths: [
        Array(361)
          .fill(null)
          .map((_, i) => {
            return centerLatLng.destinationPoint(i % 360, radius);
          }),
        [
          new naver.maps.LatLng(latMin, lngMin),
          new naver.maps.LatLng(latMax, lngMin),
          new naver.maps.LatLng(latMax, lngMax),
          new naver.maps.LatLng(latMin, lngMax),
          new naver.maps.LatLng(latMin, lngMin),
        ],
      ],
      fillColor: '#000000',
      fillOpacity: 0.1,
      strokeOpacity: 0,
      strokeWeight: 1,
    });

    return () => {
      ploygon.setMap(null);
    };
  }, [map, radius, centerLatLng]);

  return null;
}
