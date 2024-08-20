import { memo, useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';

import ColorDove from '@/assets/svgs/color-dove.svg?react';

import './index.css';
import { RIGHT } from '@/constants';

interface UserMarkerProps {
  map: naver.maps.Map;
  lat: number;
  lng: number;
  direction: LEFT | RIGHT;
  userName: string;
}

export const UserMarker = memo(({ map, lat, lng, direction, userName }: UserMarkerProps) => {
  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  /**
   * 마커 초기화
   */
  useEffect(() => {
    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(lat, lng),
      icon: {
        content: createUserMarkerContent({ direction, userName }),
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
    if (!marker) {
      return;
    }

    marker.setPosition(new naver.maps.LatLng(lat, lng));

    marker.setIcon({
      content: createUserMarkerContent({ direction, userName }),
    });
  }, [marker, lat, lng, direction, userName]);

  return null;
});

function createUserMarkerContent({ direction, userName }: { direction: LEFT | RIGHT; userName: string }) {
  return renderToString(
    <div className="user-marker flex flex-col items-center justify-center">
      <div className="user-marker-icon z-10 w-16">
        <ColorDove className={`w-full ${direction === RIGHT ? 'scale-x-[-1]' : ''}`} />
      </div>

      <div className="text-nowrap text-xs">{userName}</div>
    </div>
  );
}
