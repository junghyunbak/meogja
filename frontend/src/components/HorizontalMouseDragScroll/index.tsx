import React, { useRef, type MouseEventHandler } from 'react';

interface HorizontalMouseDragScrollProps {
  children: React.ReactNode;
}

export function HorizontalMouseDragScroll({ children }: HorizontalMouseDragScrollProps) {
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
    <div
      className="flex cursor-grab overflow-x-scroll scrollbar-hide active:cursor-grabbing"
      ref={scrollRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseLeave={handleDragEnd}
      onMouseUp={handleDragEnd}
    >
      {children}
    </div>
  );
}
