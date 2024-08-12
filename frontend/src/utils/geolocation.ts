export const getMyLatLng = (): Promise<{ lat: number; lng: number } | null> => {
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
