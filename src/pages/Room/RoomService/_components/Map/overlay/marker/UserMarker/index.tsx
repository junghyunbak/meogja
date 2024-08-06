import useStore from '@/store';
import { useEffect, useState } from 'react';
import { renderToString } from 'react-dom/server';
import ColorDove from '@/assets/svgs/color-dove.svg?react';
import './index.css';

interface UserMarkerProps {
  user: UserData;
}

/**
 * 어짜피 바뀐 사용자의 lat, lng을 내려준다. 그렇다면, 나와 타인을 나눠서
 * 나의 경우는 myLatLng을 넘겨주고 나머지는 그냥 user.lat, user.lng를 내려주면 되지 않을까?
 */
export function UserMarker({ user }: UserMarkerProps) {
  const [map] = useStore((state) => [state.map]);

  const [marker, setMarker] = useState<naver.maps.Marker | null>(null);

  useEffect(() => {
    if (!map) {
      return;
    }

    const marker = new naver.maps.Marker({
      map,
      position: new naver.maps.LatLng(user.lat || 0, user.lng || 0),
      icon: {
        content: renderToString(
          <div className="user-marker">
            <ColorDove className="w-14" />
          </div>
        ),
      },
    });

    setMarker(marker);

    return () => {
      marker.setMap(null);
    };
  }, [map]);

  useEffect(() => {
    if (!marker || !user.lat || !user.lng) {
      return;
    }

    marker.setPosition(new naver.maps.LatLng(user.lat, user.lng));
  }, [marker, user]);

  return <div />;
}
