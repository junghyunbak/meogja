import { Map } from './_components/Map';
import { Geolocation } from './_components/Geolocation';
import { JoinList } from './_components/JoinList';
import { ExitTimer } from './_components/ExitTimer';
import { RestaurantController } from './_components/RestaurantController';
import { BottomSheet } from './_components/BottomSheet';
import { RefetchIntervalMutableRoomState } from './_components/RefetchIntervalMutableRoomState';
import { RestaurantFilter } from './_components/RestaurantFilter';

export function RoomService() {
  return (
    <>
      <div className="relative flex size-full flex-col">
        <div className="pointer-events-none absolute top-0 z-20 mt-3 flex w-full flex-col">
          <JoinList />
          <div className="ml-3 mt-3 w-fit">
            <ExitTimer />
          </div>
          <RestaurantFilter />
        </div>

        <div className="absolute inset-0 z-10">
          <Map />
        </div>

        <div className="pointer-events-none absolute bottom-0 z-20 w-full">
          <RestaurantController />
        </div>
      </div>

      <BottomSheet />
      <Geolocation />
      <RefetchIntervalMutableRoomState />
    </>
  );
}

export default RoomService;
