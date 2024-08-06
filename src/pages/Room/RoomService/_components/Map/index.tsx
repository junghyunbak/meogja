import React, { useEffect, useContext, useRef } from 'react';
import { ImmutableRoomInfoContext } from '@/pages/Room';
import useStore from '@/store';
import { RestaurantMarker, UserMarker } from './overlay/marker';
import { AcitivityRadius } from './overlay/polygon';
import { IdentifierContext } from '@/pages/Room';
import { useMutation } from 'react-query';
import axios, { type AxiosError } from 'axios';

const restaurantMarkerType = (
  <RestaurantMarker restaurant={{} as Restaurant} />
).type;
const activityRadiusType = (<AcitivityRadius />).type;

interface MapMainProps {
  children?: React.ReactNode;
}

function MapMain({ children }: MapMainProps) {
  const { lat, lng } = useContext(ImmutableRoomInfoContext);

  const { roomId, userId } = useContext(IdentifierContext);

  const [setMap] = useStore((state) => [state.setMap]);
  const [setCurrentRestaurantId] = useStore((state) => [
    state.setCurrentRestaurantId,
  ]);
  const [setMyMapLatLng] = useStore((state) => [state.setMyMapLatLng]);
  const [sheetRef] = useStore((state) => [state.sheetRef]);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateMyLatLngMutation = useMutation<
    undefined,
    AxiosError,
    { lat: number; lng: number }
  >({
    mutationKey: [],
    mutationFn: async ({ lat, lng }) => {
      await axios.patch('/api/update-user-lat-lng', {
        roomId,
        userId,
        lat,
        lng,
      });
    },
  });

  /**
   * map 객체 초기화 및 이벤트 등록
   */
  useEffect(() => {
    const map = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(lat, lng),
    });

    const handleCenterChange = (center) => {
      /**
       * 낙관적 업데이트
       */
      (() => {
        if (timerRef2.current) {
          clearTimeout(timerRef2.current);
        }

        timerRef2.current = setTimeout(() => {
          setMyMapLatLng(center.y, center.x);
        }, 100);
      })();

      /**
       * 사용자 카메라 위치 api update (debouncing)
       */
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        try {
          const { x, y } = center as naver.maps.LatLng;

          updateMyLatLngMutation.mutate({ lat: y, lng: x });
        } catch (e) {
          console.log(e);
        }
      }, 2000);
    };

    const centerChangedEventListener = naver.maps.Event.addListener(
      map,
      'center_changed',
      handleCenterChange
    );

    const initEventListener = naver.maps.Event.addListener(map, 'init', (v) => [
      handleCenterChange(map.getCenter()),
    ]);

    const clickEventListener = naver.maps.Event.addListener(
      map,
      'click',
      () => {
        setCurrentRestaurantId(null);

        sheetRef?.snapTo(2);
      }
    );

    setMap(map);

    return () => {
      naver.maps.Event.removeListener(clickEventListener);
      naver.maps.Event.removeListener(centerChangedEventListener);
      naver.maps.Event.removeListener(initEventListener);
    };
  }, [setMap, setCurrentRestaurantId, lat, lng, sheetRef]);

  const restaurantMarkers = React.Children.toArray(children).filter(
    (child) =>
      React.isValidElement(child) && child.type === restaurantMarkerType
  );

  const [activityRadius] = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === activityRadiusType
  );

  /**
   * 나중에 외부로 옮겨야 할 로직
   */

  const [user] = useStore((state) => [state.user]);

  const [myMapLatLng] = useStore((state) => [state.myMapLatLng]);

  const me = user[userId];

  return (
    <>
      <div className="size-full" id="map" />

      {me && <UserMarker user={{ ...me, ...myMapLatLng }} />}

      {Object.keys(user)
        .filter((id) => id !== userId)
        .map((otherUserId) => {
          return <UserMarker user={user[otherUserId]} key={userId} />;
        })}

      {restaurantMarkers}

      {activityRadius}
    </>
  );
}

export const Map = Object.assign(MapMain, {
  UserMarker: UserMarker,
  RestaurantMarker: RestaurantMarker,
  ActivityRadius: AcitivityRadius,
});
