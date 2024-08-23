import { useContext, useEffect } from 'react';
import { useMutation } from 'react-query';

import { getMyLatLng } from '@/utils';

import { useStore } from 'zustand';
import { shallow } from 'zustand/shallow';

import { RoomIdContext } from '@/components/Preprocessing/plugins/CheckRoomId/index.context';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

import axios, { AxiosResponse, type AxiosError } from 'axios';

export function Geolocation() {
  const roomId = useContext(RoomIdContext);
  const myId = useContext(UserIdContext);

  const [setUser] = useStore(useContext(MutableRoomInfoStoreContext), (s) => [s.setUser], shallow);

  const updateUserGpsLatLngMutation = useMutation<undefined, AxiosError, { lat: number; lng: number }>({
    mutationKey: [],
    mutationFn: async ({ lat, lng }) => {
      await axios.patch<
        ResponseTemplate<object>,
        AxiosResponse<ResponseTemplate<object>>,
        { lat: number; lng: number; roomId: string; userId: string }
      >('/api/update-user-gps-lat-lng', { lat, lng, roomId, userId: myId });
    },
  });

  /**
   * 5초마다 현재 위치를 자동 업데이트
   */
  useEffect(() => {
    const updateMyLatLng = async () => {
      const latLng = await getMyLatLng();

      if (!latLng) {
        return;
      }

      setUser((prev) => {
        const next = { ...prev };

        next[myId].gpsLat = latLng.lat;
        next[myId].gpsLng = latLng.lng;

        return next;
      });

      updateUserGpsLatLngMutation.mutate(latLng);
    };

    updateMyLatLng();

    const timer = setInterval(updateMyLatLng, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return null;
}
