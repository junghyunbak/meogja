import { useEffect, useContext, useRef, useCallback } from 'react';
import { useMutation } from 'react-query';

import useStore from '@/store';

import { ImmutableRoomInfoContext, IdentifierContext } from '@/pages/Room';

import { AcitivityRadius } from '@/components/naverMap/overlay/polygon';
import { MapRestaurants } from './MapRestaurants';
import { MapUserMarkers } from './MapUserMarkers';

import { useNaverMap } from '@/hooks/useNaverMap';

import axios, { type AxiosError } from 'axios';

import * as geolib from 'geolib';

const USER_RADIUS = 150; // meter

export function Map() {
  const { lat: roomLat, lng: roomLng, restaurants } = useContext(ImmutableRoomInfoContext);
  const { roomId, userId } = useContext(IdentifierContext);

  const [setMap] = useStore((state) => [state.setMap]);
  const [setMyMapLatLng] = useStore((state) => [state.setMyMapLatLng]);
  const [setCurrentRestaurantId] = useStore((state) => [state.setCurrentRestaurantId]);
  const [setSheetIsOpen] = useStore((state) => [state.setSheetIsOpen]);

  // [ ]: debouncing을 위한 useRef 변수명 수정
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { map } = useNaverMap({ lat: roomLat, lng: roomLng, mapId: 'map' });

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
    // useMutation의 변화에 따라 callback 함수가 다시 생성될 필요가 없다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setMyMapLatLng /* updateMyLatLngMutation */]
  );

  const updateNearByRestaurant = useCallback(() => {
    if (timerRef3.current) {
      clearTimeout(timerRef3.current);
    }

    timerRef3.current = setTimeout(() => {
      if (!map) {
        return;
      }

      const { x: mapCenterLng, y: mapCenterLat } = map.getCenter();

      const pick = restaurants
        .map((restaurant) => {
          const { lat, lng } = restaurant;

          const dist = geolib.getDistance(
            { latitude: lat, longitude: lng },
            { latitude: mapCenterLat, longitude: mapCenterLng }
          );

          return { restaurant, dist };
        })
        .filter(({ dist }) => dist <= USER_RADIUS)
        .sort((a, b) => (a.dist < b.dist ? -1 : 1))[0];

      if (!pick) {
        setCurrentRestaurantId(null);

        setSheetIsOpen(false);

        return;
      }

      setCurrentRestaurantId(pick.restaurant.id);
    }, 100);
  }, [map, restaurants, setCurrentRestaurantId, setSheetIsOpen]);

  /**
   * map 전역상태 초기화 및 이벤트 등록
   */
  useEffect(() => {
    if (!map) {
      return;
    }

    setMap(map);

    updateUserMapLatLng(map.getCenter());
    updateNearByRestaurant();

    const handleMapCenterChange = (center: naver.maps.Coord) => {
      updateUserMapLatLng(center);

      updateNearByRestaurant();
    };

    const handleMapClick = () => {
      setSheetIsOpen(false);
    };

    const centerChangedEventListener = naver.maps.Event.addListener(map, 'center_changed', handleMapCenterChange);
    const clickEventListener = naver.maps.Event.addListener(map, 'click', handleMapClick);

    return () => {
      naver.maps.Event.removeListener(clickEventListener);
      naver.maps.Event.removeListener(centerChangedEventListener);
    };
  }, [map, setCurrentRestaurantId, setMap, setSheetIsOpen, updateNearByRestaurant, updateUserMapLatLng]);

  return (
    <>
      <div className="size-full" id="map" />

      <MapUserMarkers />
      <MapRestaurants />

      <AcitivityRadius map={map} />
    </>
  );
}
