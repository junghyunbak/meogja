import { ImmutableRoomInfoContext } from '@/pages/Room';
import { useContext } from 'react';
import useStore from '@/store';

export function BottomSheetContentRank() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const [map] = useStore((state) => [state.map]);
  const [user] = useStore((state) => [state.user]);
  const [setCurrentRestaurantId] = useStore((state) => [
    state.setCurrentRestaurantId,
  ]);

  const restaurantIdToPoint: Map<
    RestaurantId,
    { userId: UserId; point: number }[]
  > = new Map();

  for (const [userId, { select }] of Object.entries(user)) {
    for (let i = 0; i < Math.min(3, select.length); i++) {
      const restaurantId = select[i];

      if (!restaurantIdToPoint.has(restaurantId)) {
        restaurantIdToPoint.set(restaurantId, []);
      }

      restaurantIdToPoint.get(restaurantId)?.push({ userId, point: 3 - i });
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <p className="text-white">실시간 순위</p>

      <ul className="flex w-full flex-col gap-3 p-3">
        {[...restaurantIdToPoint].map(([restaurantId, points], i) => {
          const restaurant = restaurants.find(({ id }) => id === restaurantId);

          if (!restaurant) {
            return null;
          }

          const point = points.reduce((a, c) => a + c.point, 0);

          return (
            <li className="flex justify-around text-white" key={restaurant.id}>
              {i < 3 && <p>{i + 1}위</p>}
              <p
                className="cursor-pointer"
                onClick={() => {
                  setCurrentRestaurantId(restaurant.id);
                  map?.setCenter(
                    new naver.maps.LatLng(restaurant.lat, restaurant.lng)
                  );
                }}
              >
                {restaurant.name}
              </p>
              <p>{point}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
