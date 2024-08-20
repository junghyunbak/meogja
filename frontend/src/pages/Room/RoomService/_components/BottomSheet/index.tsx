import { useContext, useRef } from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';

import { useStore } from 'zustand';
import setGlobalStore from '@/store';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import { MutableRoomInfoStoreContext } from '@/components/Preprocessing/plugins/LoadMutableRoomData/index.context';

import * as geolib from 'geolib';

export function BottomSheet() {
  const sheetRef = useRef<SheetRef | null>(null);

  const myId = useContext(UserIdContext);

  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [currentRestaurantId] = setGlobalStore((state) => [state.currentRestaurantId]);

  const [sheetIsOpen, setSheetIsOpen] = setGlobalStore((state) => [state.sheetIsOpen, state.setSheetIsOpen]);

  const [user] = useStore(useContext(MutableRoomInfoStoreContext), (s) => [s.user]);

  const handleButtonSheetOnClose = () => {
    setSheetIsOpen(false);
  };

  const me = user[myId];

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  /**
   * 현재 선택된 식당의 선택정보를 계산
   */
  const selectUserIds: UserId[] = (() => {
    const ret: UserId[] = [];

    if (!restaurant) {
      return ret;
    }

    Object.entries(user).forEach(([userId, userData]) => {
      if (!userData.select.includes(restaurant.id)) {
        return;
      }

      ret.push(userId);
    });

    return ret;
  })();

  return (
    <Sheet
      ref={sheetRef}
      isOpen={sheetIsOpen}
      onClose={handleButtonSheetOnClose}
      snapPoints={[0.9, 0.6]}
      initialSnap={1}
      className="mx-auto max-w-[600px] cursor-grab active:cursor-grabbing"
    >
      <Sheet.Container className="!left-auto border-2 border-b-0 border-black !shadow-none">
        <Sheet.Header>
          <div className="pt-[7px]">
            <div className="mx-auto h-[4px] w-[33%] bg-black" />
          </div>
        </Sheet.Header>

        <Sheet.Content>
          {restaurant && (
            <div className="flex size-full flex-col items-center">
              <div className="flex items-center justify-center py-3">
                <p>{restaurant.name}</p>
              </div>

              {me && me.gpsLat && me.gpsLng && (
                <div className="flex w-full border-t-2 border-black">
                  <div className="flex items-center justify-center border-r-2 border-black bg-p-red p-3">
                    <p>집까지 거리</p>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <p>
                      {Math.floor(
                        geolib.getDistance(
                          { latitude: me.gpsLat, longitude: me.gpsLng },
                          { latitude: restaurant.lat, longitude: restaurant.lng }
                        ) / 1000
                      )}
                      km
                    </p>
                  </div>
                </div>
              )}

              <div className="w-full border-t-2 border-black bg-p-yellow p-3">
                <p>먹은 흔적</p>
              </div>

              {selectUserIds.length > 0 && (
                <ul className="w-full border-t-2 border-black p-3">
                  {selectUserIds.map((userId) => {
                    if (!user[userId]) {
                      return null;
                    }

                    return (
                      <li key={userId}>
                        <p>
                          {user[userId].userName}
                          <span>{userId === myId ? ' (나)' : ''}</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}

              <iframe src={restaurant.placeUrl} className="size-full border-t-2 border-black" />
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
