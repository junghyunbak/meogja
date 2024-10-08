import StrokeDove from '@/assets/svgs/stroke-dove.svg?react';
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleStartButtonClick = () => {
    navigate('/create-room');
  };

  return (
    <div className="relative flex size-full items-center justify-center">
      <div className="flex flex-col items-center gap-8">
        <StrokeDove className="w-2/3" />

        <div className="flex h-4 items-center gap-2 overflow-hidden [&>p]:text-base">
          <p>비둘기야 같이</p>
          <Slider
            autoplay
            autoplaySpeed={2000}
            vertical
            slidesToShow={1}
            rtl
            speed={500}
            pauseOnHover={false}
            className="w-10"
          >
            <p className="text-center text-[#693939]">커피</p>
            <p className="text-center text-[#CDB8B8]">밥</p>
          </Slider>
          <p>먹자</p>
        </div>
        <div
          onClick={handleStartButtonClick}
          className="flex w-fit cursor-pointer items-center justify-center border-2 border-black p-3"
        >
          <p className="text-sm">활동 영역 정하기</p>
        </div>
      </div>

      <div className="absolute bottom-9">
        <p className="text-xs">죽어서도 행복할 비둘기처럼</p>
      </div>
    </div>
  );
}

export default Home;
