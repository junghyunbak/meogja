import { useEffect, useContext, useRef, useCallback } from 'react';
import { useMutation } from 'react-query';

import useStore from '@/store';

import { ImmutableRoomInfoContext, IdentifierContext } from '@/pages/Room';

import { RestaurantMarker, UserMarker } from '@/components/naverMap/overlay/marker';
import { AcitivityRadius } from '@/components/naverMap/overlay/polygon';

import { useNaverMap } from '@/hooks/useNaverMap';

import axios, { type AxiosError } from 'axios';

export function Map() {
  const { lat, lng } = useContext(ImmutableRoomInfoContext);
  const { roomId, userId } = useContext(IdentifierContext);

  const [sheetRef] = useStore((state) => [state.sheetRef]);

  const [setMap] = useStore((state) => [state.setMap]);
  const [setMyMapLatLng] = useStore((state) => [state.setMyMapLatLng]);
  const [setCurrentRestaurantId] = useStore((state) => [state.setCurrentRestaurantId]);

  // [ ]: debouncing을 위한 useRef 변수명 수정
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { map } = useNaverMap({ lat, lng, mapId: 'map' });

  const updateMyLatLngMutation = useMutation<undefined, AxiosError, { lat: number; lng: number }>({
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

  const updateUserMapLatLng = useCallback(
    (center: naver.maps.Coord) => {
      (() => {
        if (timerRef2.current) {
          clearTimeout(timerRef2.current);
        }

        timerRef2.current = setTimeout(() => {
          setMyMapLatLng(center.y, center.x);
        }, 100);
      })();

      (() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          const { x, y } = center;

          updateMyLatLngMutation.mutate({ lat: y, lng: x });
        }, 1000);
      })();
    },
    [setMyMapLatLng, updateMyLatLngMutation]
  );

  /**
   * map 이벤트 등록
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    setMap(map);

    const handleMapCenterChange = (center: naver.maps.Coord) => {
      updateUserMapLatLng(center);
    };

    const handleMapInit = () => {
      updateUserMapLatLng(map.getCenter());
    };

    const handleMapClick = () => {
      setCurrentRestaurantId(null);

      sheetRef?.snapTo(2);
    };

    const centerChangedEventListener = naver.maps.Event.addListener(map, 'center_changed', handleMapCenterChange);
    const initEventListener = naver.maps.Event.addListener(map, 'init', handleMapInit);
    const clickEventListener = naver.maps.Event.addListener(map, 'click', handleMapClick);

    setMap(map);

    return () => {
      naver.maps.Event.removeListener(clickEventListener);
      naver.maps.Event.removeListener(centerChangedEventListener);
      naver.maps.Event.removeListener(initEventListener);
    };
  }, [map, setCurrentRestaurantId, setMap, sheetRef, updateUserMapLatLng]);

  return (
    <>
      <div className="size-full" id="map" />

      <UserMarkers />
      <RestaurantMarkers />

      <AcitivityRadius map={map} />
    </>
  );
}

function UserMarkers() {
  const { userId } = useContext(IdentifierContext);

  const [map] = useStore((state) => [state.map]);
  const [user] = useStore((state) => [state.user]);
  const [myMapLatLng] = useStore((state) => [state.myMapLatLng]);

  const me = user[userId];

  return (
    <>
      {me && <UserMarker userData={{ ...me, ...myMapLatLng }} map={map} />}

      {Object.keys(user)
        .filter((id) => id !== userId)
        .map((otherUserId) => {
          return <UserMarker userData={user[otherUserId]} key={userId} map={map} />;
        })}
    </>
  );
}

function RestaurantMarkers() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [map] = useStore((state) => [state.map]);

  return (
    <>
      {restaurants.map((restaurant) => {
        return <RestaurantMarker key={restaurant.id} map={map} restaurant={restaurant} />;
      })}
    </>
  );
}
