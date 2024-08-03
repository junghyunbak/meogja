import useStore from '@/store';

const MENU_ITEM: { state: SheetState; title: string }[] = [
  {
    state: 'chat',
    title: '채팅',
  },
  {
    state: 'picky',
    title: '편식할래요',
  },
  {
    state: 'rank',
    title: '실시간선택',
  },
  {
    state: 'select',
    title: '나의선택',
  },
];

export function Nav() {
  return (
    <div className="w-full border-t border-white bg-bg px-4 py-3">
      <ul className="flex w-full items-center justify-between">
        {MENU_ITEM.map(({ state, title }, i) => (
          <li key={i}>
            <NavItem state={state} title={title} />
          </li>
        ))}
      </ul>
    </div>
  );
}

interface NavItemProps {
  state: SheetState;
  title: string;
}

function NavItem({ state, title }: NavItemProps) {
  const [sheetState, setSheetState] = useStore((state) => [
    state.sheetState,
    state.setSheetState,
  ]);

  const handleNavItemClick = () => {
    if (sheetState === state) {
      setSheetState('close');

      return;
    }

    setSheetState(state);
  };

  return (
    <div className="cursor-pointer" onClick={handleNavItemClick}>
      <p className={`${sheetState === state ? 'text-primary' : 'text-white'}`}>
        {title}
      </p>
    </div>
  );
}
