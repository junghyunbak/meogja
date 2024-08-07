import useStore from '@/store';
import { useEffect } from 'react';

export function Geolocation() {
  const [setMyGpsLatLng] = useStore((state) => [state.setMyGpsLatLng]);

  useEffect(() => {
    const getMyLatLng = (): Promise<{ lat: number; lng: number } | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          resolve(null);
        }

        const successCallback: PositionCallback = (position) => {
          const {
            coords: { latitude, longitude },
          } = position;

          resolve({ lat: latitude, lng: longitude });
        };

        const errorCallback: PositionErrorCallback = () => {
          resolve(null);
        };

        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
      });
    };

    const updateMyLatLng = async () => {
      setMyGpsLatLng(await getMyLatLng());
    };

    updateMyLatLng();

    const timer = setInterval(updateMyLatLng, 5000);

    return () => {
      clearInterval(timer);
    };
  }, [setMyGpsLatLng]);

  return null;
}
