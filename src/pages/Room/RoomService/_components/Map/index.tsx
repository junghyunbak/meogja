import { useEffect, useContext, useRef, useCallback } from 'react';
import { useMutation } from 'react-query';

import useStore from '@/store';

import { ImmutableRoomInfoContext, IdentifierContext } from '@/pages/Room';

import { AcitivityRadius } from '@/components/naverMap/overlay/polygon';
import { MapRestaurants } from './MapRestaurants';
import { MapUserMarkers } from './MapUserMarkers';

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

      <MapUserMarkers />
      <MapRestaurants />

      <AcitivityRadius map={map} />
    </>
  );
}
