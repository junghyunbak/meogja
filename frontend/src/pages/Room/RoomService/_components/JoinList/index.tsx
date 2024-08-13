import { useContext } from 'react';

import useStore from '@/store';

import ColorDove from '@/assets/svgs/color-dove.svg?react';

import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';
import { HorizontalMouseDragScroll } from '@/components/HorizontalMouseDragScroll';

export function JoinList() {
  const [user] = useStore((state) => [state.user]);
  const [map] = useStore((state) => [state.map]);

  const myId = useContext(UserIdContext);

  return (
    <div className="pointer-events-auto w-fit max-w-full">
      <HorizontalMouseDragScroll>
        {Object.keys(user).map((userId) => {
          const { userName, lat, lng } = user[userId];

          return (
            <div
              className={`ml-3 flex flex-col items-center border-2 border-black bg-white p-2 py-1 last-of-type:mr-3 ${userId === myId ? 'cursor-default' : ''}`}
              onClick={() => {
                if (!map || !lat || !lng || myId === userId) {
                  return;
                }

                map.setCenter(new naver.maps.LatLng(lat, lng));
              }}
              key={userId}
            >
              <ColorDove className="w-10" />
              <p className="select-none text-nowrap text-xs">{`${userName} ${myId === userId ? '(나)' : ''}`}</p>
            </div>
          );
        })}
      </HorizontalMouseDragScroll>
    </div>
  );
}
