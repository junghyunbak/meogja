import { useEffect, useContext, useRef, useCallback } from 'react';

import useGlobalStore from '@/store';
import { useStore } from 'zustand';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';
import { MapContext } from '../..';

import { useUpdateUserMapLatLng } from '@/hooks/useUpdateUserMapLatLng';

import { LEFT, RIGHT } from '@/constants';

import * as geolib from 'geolib';

import _ from 'lodash';

const USER_RADIUS_M = 150;

export function Map() {
  const { lng, restaurants } = useContext(ImmutableRoomInfoContext);

  const roomId = useContext(RoomIdContext);

  const myId = useContext(UserIdContext);

  const { map } = useContext(MapContext);

  const [setUser] = useStore(useContext(MutableRoomInfoStoreContext), (s) => [s.setUser]);

  const [setCurrentRestaurantId] = useGlobalStore((s) => [s.setCurrentRestaurantId]);

  const [setSheetIsOpen] = useGlobalStore((s) => [s.setSheetIsOpen]);

  const [currentCategory] = useGlobalStore((s) => [s.currentCategory]);

  const updateUserMapLatLngMutation = useUpdateUserMapLatLng(roomId, myId);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timerRef2 = useRef<ReturnType<typeof setTimeout> | null>(null);

  const prevLngRef = useRef<number>(lng);

  const updateUserMapLatLng = useCallback((center: naver.maps.Coord) => {
    const { x: centerLng, y: centerLat } = center;

    const direction: LEFT | RIGHT = centerLng < prevLngRef.current ? RIGHT : LEFT;

    prevLngRef.current = centerLng;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      setUser((prev) => {
        const next = _.cloneDeep(prev);

        const me = next[myId];

        if (!me) {
          return prev;
        }

        me.lat = centerLat;
        me.lng = centerLng;
        me.direction = direction;

        return next;
      });

      updateUserMapLatLngMutation.mutate({ lat: centerLat, lng: centerLng, direction });
    }, 100);
  }, []);

  const updateNearByRestaurant = useCallback(() => {
    if (timerRef2.current) {
      clearTimeout(timerRef2.current);
    }

    timerRef2.current = setTimeout(() => {
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
  }, [updateUserMapLatLng]);

  return null;
}
