import useStore from '@/store';
import { useEffect } from 'react';

interface GeolocationProps {}

export function Geolocation({}: GeolocationProps) {
  const [setMyLatLng] = useStore((state) => [state.setMyLatLng]);

  useEffect(() => {
    const getMyLatLng = (): Promise<{ lat: number; lng: number }> => {
      return new Promise((resolve) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((position) => {
            const {
              coords: { latitude, longitude },
            } = position;

            resolve({ lat: latitude, lng: longitude });
          });
        }
      });
    };

    const updateMyLatLng = async () => {
      const { lat, lng } = await getMyLatLng();

      setMyLatLng(lat, lng);
    };

    updateMyLatLng();

    const timer = setInterval(updateMyLatLng, 5000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div />;
}
