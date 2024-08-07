import { useContext, useRef } from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';

import useStore from '@/store';

import * as geolib from 'geolib';
import { UserIdContext } from '@/pages/Room/_components/CheckUserId/index.context';
import { ImmutableRoomInfoContext } from '@/pages/Room/_components/LoadImmutableRoomData/index.context';

export function BottomSheet() {
  const sheetRef = useRef<SheetRef | null>(null);

  const myId = useContext(UserIdContext);
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [user] = useStore((state) => [state.user]);
  const [currentRestaurantId] = useStore((state) => [state.currentRestaurantId]);
  const [sheetIsOpen, setSheetIsOpen] = useStore((state) => [state.sheetIsOpen, state.setSheetIsOpen]);
  const [myGpsLatLng] = useStore((state) => [state.myGpsLatLng]);
  const [mySelect] = useStore((state) => [state.mySelect]);

  const handleButtonSheetOnClose = () => {
    setSheetIsOpen(false);
  };

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  /**
   * 현재 선택된 식당의 선택정보를 계산
   */
  const selectUserIds: UserId[] = (() => {
    const ret: UserId[] = [];

    if (!restaurant) {
      return ret;
    }

    if (mySelect.includes(restaurant.id)) {
      ret.push(myId);
    }

    Object.entries(user).forEach(([userId, userData]) => {
      if (userId === myId) {
        return;
      }

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
      <Sheet.Container className="!left-auto border border-black !shadow-none">
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

              {myGpsLatLng && (
                <div className="flex w-full border-t border-black">
                  <div className="flex items-center justify-center border-r border-black bg-p-red p-3">
                    <p>집까지 거리</p>
                  </div>
                  <div className="flex flex-1 items-center justify-center">
                    <p>
                      {Math.floor(
                        geolib.getDistance(
                          { latitude: myGpsLatLng.lat, longitude: myGpsLatLng.lng },
                          { latitude: restaurant.lat, longitude: restaurant.lng }
                        ) / 1000
                      )}
                      km
                    </p>
                  </div>
                </div>
              )}

              <div className="w-full border-t border-black bg-p-yellow p-3">
                <p>먹은 흔적</p>
              </div>

              {selectUserIds.length > 0 && (
                <ul className="w-full border-t border-black p-3">
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

              <iframe src={restaurant.placeUrl} className="size-full border-t border-black" />
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
