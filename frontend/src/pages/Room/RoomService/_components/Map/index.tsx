import { useEffect, useContext, useRef, useCallback } from 'react';
import { useMutation } from 'react-query';

import useStore from '@/store';

import axios, { type AxiosError } from 'axios';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { useMutationTimeContext } from '@/pages/Room/_components/MutationTimeProvider/index.context';
import { MapContext } from '../..';

import { LEFT, RIGHT } from '@/constants';

import * as geolib from 'geolib';

const USER_RADIUS_M = 150;

export function Map() {
  const { lng, restaurants } = useContext(ImmutableRoomInfoContext);
  const roomId = useContext(RoomIdContext);
  const userId = useContext(UserIdContext);
  const { map } = useContext(MapContext);
  const mutationTime = useMutationTimeContext();

  const [setMap] = useStore((state) => [state.setMap]);
  const [setMyMapLatLng] = useStore((state) => [state.setMyMapLatLng]);
  const [setMyDirection] = useStore((state) => [state.setMyDirection]);
  const [setCurrentRestaurantId] = useStore((state) => [state.setCurrentRestaurantId]);
  const [setSheetIsOpen] = useStore((state) => [state.setSheetIsOpen]);
  const [currentCategory] = useStore((state) => [state.currentCategory]);

  // [ ]: debouncing을 위한 useRef 변수명 수정
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);
  const timerRef3 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prevLngRef = useRef<number>(lng);

  const updateMyLatLngMutation = useMutation<
    undefined,
    AxiosError,
    { lat: number; lng: number; direction: LEFT | RIGHT }
  >({
    mutationKey: [],
    mutationFn: async ({ lat, lng, direction }) => {
      mutationTime.current = Date.now();

      await axios.patch('/api/update-user-lat-lng', {
        roomId,
        userId,
        lat,
        lng,
        direction,
      });
    },
  });

  const updateUserMapLatLng = useCallback((center: naver.maps.Coord) => {
    const { x: centerLng, y: centerLat } = center;

    const direction: LEFT | RIGHT = centerLng < prevLngRef.current ? RIGHT : LEFT;

    prevLngRef.current = centerLng;

    (() => {
      if (timerRef2.current) {
        clearTimeout(timerRef2.current);
      }

      timerRef2.current = setTimeout(() => {
        setMyMapLatLng(centerLat, centerLng);
        setMyDirection(direction);
      }, 100);
    })();

    (() => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        updateMyLatLngMutation.mutate({ lat: centerLat, lng: centerLng, direction });
      }, 100);
    })();
  }, []);

  const updateNearByRestaurant = useCallback(() => {
    if (timerRef3.current) {
      clearTimeout(timerRef3.current);
    }

    timerRef3.current = setTimeout(() => {
      const { x: mapCenterLng, y: mapCenterLat } = map.getCenter();

      const pick = restaurants
        .filter((restaurant) => {
          if (currentCategory === null) {
            return true;
          }

          return restaurant.categoryName.includes(currentCategory);
        })
        .map((restaurant) => {
          const { lat, lng } = restaurant;

          const dist = geolib.getDistance(
            { latitude: lat, longitude: lng },
            { latitude: mapCenterLat, longitude: mapCenterLng }
          );

          return { restaurant, dist };
        })
        .filter(({ dist }) => dist <= USER_RADIUS_M)
        .sort((a, b) => (a.dist < b.dist ? -1 : 1))[0];

      if (!pick) {
        setCurrentRestaurantId(null);

        setSheetIsOpen(false);

        return;
      }

      setCurrentRestaurantId(pick.restaurant.id);
    }, 100);
  }, [currentCategory]);

  /**
   * map 전역상태 초기화 및 이벤트 등록
   */
  useEffect(() => {
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

  return null;
}
