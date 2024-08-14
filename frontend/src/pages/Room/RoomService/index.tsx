import { Map } from './_components/Map';
import { Geolocation } from './_components/Geolocation';
import { ExitTimer } from './_components/ExitTimer';
import { RestaurantController } from './_components/RestaurantController';
import { BottomSheet } from './_components/BottomSheet';
import { RefetchIntervalMutableRoomState } from './_components/RefetchIntervalMutableRoomState';
import { RestaurantFilter } from './_components/RestaurantFilter';
import { RestaurantCategoryFilter } from './_components/RestaurantCategoryFilter';

export function RoomService() {
  return (
    <>
      <div className="relative flex size-full flex-col">
        <div className="pointer-events-none absolute top-0 z-20 mt-3 flex w-full flex-col gap-3">
          <RestaurantCategoryFilter />
          <RestaurantFilter />
        </div>

        <div className="absolute inset-0 z-10">
          <Map />
        </div>

        <div className="pointer-events-none absolute bottom-0 z-20 w-full">
          <RestaurantController />
        </div>

        <div className="absolute bottom-0 right-0 z-20 p-3">
          <ExitTimer />
        </div>
      </div>

      <BottomSheet />
      <Geolocation />
      <RefetchIntervalMutableRoomState />
    </>
  );
}
