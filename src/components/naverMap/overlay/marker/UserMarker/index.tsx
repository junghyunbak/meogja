import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import ColorDove from '@/assets/svgs/color-dove.svg?react';

import './index.css';
import { RIGHT } from '@/constants';

interface UserMarkerProps {
  userData: UserData;
  map: naver.maps.Map | null;
}

export function UserMarker({ userData, map }: UserMarkerProps) {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 마커 초기화
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(userData.lat || 0, userData.lng || 0),
      icon: {
        content: createUserMarkerContent(userData.direction),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
    // `userData`는 초기값을 설정하는데만 사용하기 때문에, 의존성 배열에 고의적으로 추가하지 않음.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  /**
   * 위치 변경 시 마커 정보 변경
   */
  useEffect(() => {
    if (!marker || !userData.lat || !userData.lng) {
      return;
    }

    marker.setPosition(new naver.maps.LatLng(userData.lat, userData.lng));
    marker.setIcon({
      content: createUserMarkerContent(userData.direction),
    });
  }, [marker, userData]);

  return null;
}

function createUserMarkerContent(direction: LEFT | RIGHT) {
  return renderToString(
    <div className="user-marker">
      <ColorDove className={`w-16 ${direction === RIGHT ? 'scale-x-[-1]' : ''}`} />
    </div>
  );
}
