interface NavProps {}

export function Nav({}: NavProps) {
  return (
    <div className="flex w-full items-center justify-between border-t border-white bg-bg px-4 py-3 [&>p]:cursor-pointer [&>p]:text-white">
      <p>채팅</p>
      <p>편식할래요</p>
      <p>실시간순위</p>
      <p>나의선택</p>
    </div>
  );
}
