import { useContext, useRef } from 'react';
import { Sheet, SheetRef } from 'react-modal-sheet';

import useStore from '@/store';

import { ImmutableRoomInfoContext } from '@/pages/Room';

import * as geolib from 'geolib';

export function BottomSheet() {
  const sheetRef = useRef<SheetRef | null>(null);

  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [currentRestaurantId] = useStore((state) => [state.currentRestaurantId]);
  const [sheetIsOpen, setSheetIsOpen] = useStore((state) => [state.sheetIsOpen, state.setSheetIsOpen]);
  const [user] = useStore((state) => [state.user]);
  const [myGpsLatLng] = useStore((state) => [state.myLatLng]);

  const handleButtonSheetOnClose = () => {
    setSheetIsOpen(false);
  };

  const restaurant = restaurants.find(({ id }) => id === currentRestaurantId);

  const selectUserIds: UserId[] = [];

  Object.entries(user).forEach(([userId, userData]) => {
    if (restaurant && !userData.select.includes(restaurant.id)) {
      return;
    }

    selectUserIds.push(userId);
  });

  return (
    <Sheet
      ref={sheetRef}
      isOpen={sheetIsOpen}
      onClose={handleButtonSheetOnClose}
      snapPoints={[0.85, 0.5]}
      initialSnap={1}
      className="mx-auto max-w-[600px]"
    >
      <Sheet.Container className="!left-auto cursor-grab border border-black !shadow-none active:cursor-grabbing">
        <Sheet.Header>
          <div className="pt-[7px]">
            <div className="mx-auto h-[4px] w-[33%] bg-black" />
          </div>
        </Sheet.Header>

        <Sheet.Content className="cursor-default">
          {restaurant && (
            <div className="flex size-full flex-col items-center">
              <div className="flex items-center justify-center py-3">
                <p>{restaurant.name}</p>
              </div>

              <div className="flex w-full border-t border-black">
                <div className="bg-p-red flex items-center justify-center border-r border-black p-3">
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

              <div className="bg-p-yellow w-full border-t border-black p-3">
                <p>먹은 흔적</p>
              </div>

              <ul className="w-full border-t border-black p-3">
                {selectUserIds.map((userId) => {
                  if (!user[userId]) {
                    return null;
                  }

                  return <li key={userId}>{user[userId].userName}</li>;
                })}
              </ul>

              <iframe src={restaurant.placeUrl} className="size-full border-t border-black" />
            </div>
          )}
        </Sheet.Content>
      </Sheet.Container>
    </Sheet>
  );
}
