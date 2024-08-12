import useStore from '@/store';
import ColorDove from '@/assets/svgs/color-dove.svg?react';
import { useContext, useRef } from 'react';
import { type MouseEventHandler } from 'react';
import { UserIdContext } from '@/components/Preprocessing/plugins/CheckUserId/index.context';

export function JoinList() {
  const [user] = useStore((state) => [state.user]);
  const [map] = useStore((state) => [state.map]);

  const myId = useContext(UserIdContext);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef<boolean>(false);
  const startX = useRef<number>(0);
  const scrollLeft = useRef<number>(0);

  const handleDragStart: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!scrollRef.current) {
      return;
    }

    isDragging.current = true;

    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleDragMove: MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDragging.current || !scrollRef.current) {
      return;
    }

    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX.current;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleDragEnd: MouseEventHandler<HTMLDivElement> = () => {
    isDragging.current = false;
  };

  return (
    <div className="pointer-events-auto w-fit max-w-full cursor-grab active:cursor-grabbing">
      <div
        className="flex overflow-x-scroll scrollbar-hide"
        ref={scrollRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseLeave={handleDragEnd}
        onMouseUp={handleDragEnd}
      >
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
      </div>
    </div>
  );
}
