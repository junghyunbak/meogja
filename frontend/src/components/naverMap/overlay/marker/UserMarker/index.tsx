import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import ColorDove from '@/assets/svgs/color-dove.svg?react';

import './index.css';
import { RIGHT } from '@/constants';

interface UserMarkerProps {
  userData: UserData;
  map: naver.maps.Map;
}

export function UserMarker({ userData, map }: UserMarkerProps) {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 마커 초기화
   */
  useEffect(() => {
    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(userData.lat || 0, userData.lng || 0),
      icon: {
        content: createUserMarkerContent(userData),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
  }, []);

  /**
   * 위치 변경 시 마커 정보 변경
   */
  useEffect(() => {
    if (!marker || !userData.lat || !userData.lng) {
      return;
    }

    marker.setPosition(new naver.maps.LatLng(userData.lat, userData.lng));
    marker.setIcon({
      content: createUserMarkerContent(userData),
    });
  }, [marker, userData]);

  return null;
}

function createUserMarkerContent(userData: UserData) {
  return renderToString(
    <div className="user-marker flex flex-col items-center justify-center">
      <div className="user-marker-icon z-10 w-16">
        <ColorDove className={`w-full ${userData.direction === RIGHT ? 'scale-x-[-1]' : ''}`} />
      </div>

      <div className="text-nowrap text-xs">{userData.userName}</div>
    </div>
  );
}
