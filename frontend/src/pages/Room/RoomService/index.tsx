import { Map } from './_components/Map';
import { Geolocation } from './_components/Geolocation';
import { ExitTimer } from './_components/ExitTimer';
import { RestaurantController } from './_components/RestaurantController';
import { BottomSheet } from './_components/BottomSheet';
import { RefetchIntervalMutableRoomState } from './_components/RefetchIntervalMutableRoomState';
import { RestaurantFilter } from './_components/RestaurantFilter';
import { RestaurantCategoryFilter } from './_components/RestaurantCategoryFilter';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MapUserMarkers } from './_components/MapUserMarkers';
import { MapRestaurantMarkers } from './_components/MapRestaurantMarkers';
import { ActivityRadius } from '@/components/naverMap/overlay/polygon';

type MapContextValue = {
  map: naver.maps.Map;
};

export const MapContext = createContext<MapContextValue>({} as MapContextValue);

export function RoomService() {
  const { lat, lng, radius } = useContext(ImmutableRoomInfoContext);

  const ref = useRef<HTMLDivElement | null>(null);

  const [map, setMap] = useState<naver.maps.Map | null>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    setMap(new naver.maps.Map(ref.current, { center: new naver.maps.LatLng(lat, lng), zoom: 16 }));
  }, []);

  return (
    <div className="relative size-full">
      <div className="size-full" ref={ref} />

      {map && (
        <MapContext.Provider value={{ map }}>
          <div className="pointer-events-none absolute top-0 z-20 mt-3 flex w-full flex-col gap-3">
            <RestaurantCategoryFilter />
            <RestaurantFilter />
          </div>

          <div className="pointer-events-none absolute bottom-0 z-20 w-full">
            <RestaurantController />
          </div>

          <div className="absolute bottom-0 right-0 z-20 p-3">
            <ExitTimer />
          </div>

          <Map />
          <MapUserMarkers />
          <MapRestaurantMarkers />

          <ActivityRadius map={map} centerLatLng={new naver.maps.LatLng(lat, lng)} radius={radius * 1000} />

          <BottomSheet />
          <Geolocation />
          <RefetchIntervalMutableRoomState />
        </MapContext.Provider>
      )}
    </div>
  );
}
