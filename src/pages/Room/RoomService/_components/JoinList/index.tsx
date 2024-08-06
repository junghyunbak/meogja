import useStore from '@/store';
import ColorDove from '@/assets/svgs/color-dove.svg?react';
import { useRef } from 'react';
import { type MouseEventHandler } from 'react';

export function JoinList() {
  const [user] = useStore((state) => [state.user]);

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
        className="scrollbar-hide flex overflow-x-scroll"
        ref={scrollRef}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseLeave={handleDragEnd}
        onMouseUp={handleDragEnd}
      >
        {Object.keys(user).map((userId) => {
          return (
            <div
              className="ml-3 flex flex-col items-center border border-black bg-white p-2 py-1 last-of-type:mr-3"
              key={userId}
            >
              <ColorDove className="w-10" />
              <p className="select-none text-nowrap text-xs">{user[userId].userName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
