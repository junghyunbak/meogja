import useStore from '@/store';
import ColorDove from '@/assets/svgs/color-dove.svg?react';

// [ ]: 가로 스크롤 드래구 구현
export function JoinList() {
  const [user] = useStore((state) => [state.user]);

  return (
    <div className="w-full cursor-grab p-3 active:cursor-grabbing">
      <ul className="flex">
        {Object.keys(user).map((userId) => {
          return (
            <li
              className="flex flex-col items-center border border-black bg-white p-2 py-1"
              key={userId}
            >
              <ColorDove className="w-10" />
              <p className="text-xs">{user[userId].userName}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
