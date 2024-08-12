import { useState, useRef, useEffect } from 'react';
import { useNaverMap } from '@/hooks/useNaverMap';
import { defaultValue } from '../..';
import { getMyLatLng } from '@/utils';

interface MapProps {
  radius: number;
  updateLatLng: (lat: number, lng: number) => void;
}

export function Map({ radius, updateLatLng }: MapProps) {
  const { map } = useNaverMap({
    lat: defaultValue.lat,
    lng: defaultValue.lng,
    mapId: 'create-room-map',
  });

  const [centerLatLng, setCenterLatLng] = useState(new naver.maps.LatLng(defaultValue.lat, defaultValue.lng));

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [circle, setCircle] = useState<naver.maps.Circle | null>(null);
  const [polyline, setPolyline] = useState<naver.maps.Polyline | null>(null);
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  const [isGpsLoading, setIsGpsLoading] = useState(false);

  /**
   * circle, polyline, marker 오버레이 생성
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const handleMapCenterChange = (center: naver.maps.Coord) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const { x: lng, y: lat } = center;

        setCenterLatLng(new naver.maps.LatLng(lat, lng));

        updateLatLng(lat, lng);
      }, 100);
    };

    const centerChangedEventListener = naver.maps.Event.addListener(map, 'center_changed', handleMapCenterChange);

    const circle = new naver.maps.Circle({
      map,
      center: centerLatLng,
      radius: radius * 1000,
      fillColor: '#000000',
      fillOpacity: 0.05,
      strokeColor: '#000000',
      strokeWeight: 2,
    });

    setCircle(circle);

    const polyline = new naver.maps.Polyline({
      map,
      path: [centerLatLng, centerLatLng.destinationPoint(90, 1000)],
      strokeColor: '#000000',
      strokeWeight: 2,
    });

    setPolyline(polyline);

    const marker = new naver.maps.Marker({
      map,
      icon: {
        content: `<div class="text-xs select-none">${radius}km</div>`,
      },
      position: centerLatLng.destinationPoint(90, 500),
      clickable: false,
    });

    setMarker(marker);

    return () => {
      naver.maps.Event.removeListener(centerChangedEventListener);

      circle.setMap(null);
      polyline.setMap(null);
      marker.setMap(null);
    };
  }, [map]);

  /**
   * 화면 위치가 달라짐에 따라 오버레이 위치 변경
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    if (circle) {
      circle.setRadius(radius * 1000);
      circle.setCenter(centerLatLng);
    }

    if (polyline) {
      polyline.setPath([centerLatLng, centerLatLng.destinationPoint(90, radius * 1000)]);
    }

    if (marker) {
      marker.setIcon({ content: `<div class="text-xs select-none">${radius}km</div>` });
      marker.setPosition(centerLatLng.destinationPoint(90, (radius * 1000) / 2));
    }
  }, [map, circle, polyline, centerLatLng, marker, radius]);

  const handleGpsButtonClick = async () => {
    if (!map) {
      return;
    }

    setIsGpsLoading(true);

    const latLng = await getMyLatLng();

    if (!latLng) {
      return;
    }

    map.setCenter(new naver.maps.LatLng(latLng.lat, latLng.lng));

    setIsGpsLoading(false);
  };

  return (
    <div className="relative size-full">
      <div id="create-room-map" className="size-full" />
      <div className="absolute bottom-0 left-0 m-3 cursor-pointer bg-black p-2" onClick={handleGpsButtonClick}>
        <p className="text-sm text-white">{isGpsLoading ? '로딩 중...' : '내 위치로 이동'}</p>
      </div>
    </div>
  );
}
