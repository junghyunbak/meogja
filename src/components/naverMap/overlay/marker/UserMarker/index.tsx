import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import ColorDove from '@/assets/svgs/color-dove.svg?react';

import './index.css';

interface UserMarkerProps {
  userData: UserData;
  map: naver.maps.Map | null;
}

export function UserMarker({ userData, map }: UserMarkerProps) {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(userData.lat || 0, userData.lng || 0),
      icon: {
        content: renderToString(
          <div className="user-marker z-10">
            <ColorDove className="w-14" />
          </div>
        ),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
    // `userData`는 초기값을 설정하는데만 사용하기 때문에, 의존성 배열에 고의적으로 추가하지 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  useEffect(() => {
    if (!marker || !userData.lat || !userData.lng) {
      return;
    }

    marker.setPosition(new naver.maps.LatLng(userData.lat, userData.lng));
  }, [marker, userData]);

  return null;
}
