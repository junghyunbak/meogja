import { HorizontalMouseDragScroll } from '@/components/HorizontalMouseDragScroll';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import useStore from '@/store';
import { useContext } from 'react';

export function RestaurantCategoryFilter() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const categories = Array.from(
    new Set(
      restaurants.reduce<string[]>(
        (arr, { categoryName }) => [
          ...arr,
          ...categoryName
            .split(/>|,/)
            .map((v) => v.trim())
            .filter((v) => v !== ''),
        ],
        []
      )
    )
  );

  return (
    <div className="pointer-events-auto max-w-full">
      <HorizontalMouseDragScroll>
        <CategoryItem categoryName="전체" categoryIdentify={null} />

        {categories.map((category) => {
          return <CategoryItem key={category} categoryName={category} categoryIdentify={category} />;
        })}
      </HorizontalMouseDragScroll>
    </div>
  );
}

interface CategoryItemProps {
  categoryName: string;
  categoryIdentify: string | null;
}

function CategoryItem({ categoryName, categoryIdentify }: CategoryItemProps) {
  const [currentCategory, setCurrentCategory] = useStore((state) => [state.currentCategory, state.setCurrentCategory]);

  const handleCategoryClick = (category: string | null) => {
    return () => {
      setCurrentCategory(currentCategory === category ? null : category);
    };
  };

  return (
    <div
      className={`ml-3 w-fit select-none border-2 border-black p-2 last-of-type:mr-3 ${currentCategory === categoryIdentify ? 'bg-p-yg' : 'bg-white'}`}
      onClick={handleCategoryClick(categoryIdentify)}
    >
      <p className="text-nowrap text-sm">{categoryName}</p>
    </div>
  );
}
