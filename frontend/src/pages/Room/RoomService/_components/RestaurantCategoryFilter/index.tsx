import { HorizontalMouseDragScroll } from '@/components/HorizontalMouseDragScroll';
import { ImmutableRoomInfoContext } from '@/components/Preprocessing/plugins/LoadImmutableRoomData/index.context';
import useStore from '@/store';
import { useContext } from 'react';

export function RestaurantCategoryFilter() {
  const { restaurants } = useContext(ImmutableRoomInfoContext);

  const categoryNameToCount = new Map<string, number>();

  restaurants.forEach(({ categoryName }) => {
    categoryName
      .split(/>|,/)
      .map((v) => v.trim())
      .filter((v) => v !== '')
      .forEach((v) => {
        categoryNameToCount.set(v, (categoryNameToCount.get(v) || 0) + 1);
      });
  });

  const categories: { name: string; count: number }[] = [...categoryNameToCount.entries()]
    .map(([name, count]) => ({
      name,
      count,
    }))
    .sort((a, b) => (a.count > b.count ? -1 : 1));

  restaurants.reduce<string[]>((arr, { categoryName }) => [...arr, ...categoryName], []);

  return (
    <div className="pointer-events-auto max-w-full">
      <HorizontalMouseDragScroll>
        <CategoryItem categoryName="전체" categoryIdentify={null} count={restaurants.length} />

        {categories.map((category) => {
          const { name, count } = category;

          return <CategoryItem key={name} categoryName={name} categoryIdentify={name} count={count} />;
        })}
      </HorizontalMouseDragScroll>
    </div>
  );
}

interface CategoryItemProps {
  categoryName: string;
  categoryIdentify: string | null;
  count: number;
}

function CategoryItem({ categoryName, categoryIdentify, count }: CategoryItemProps) {
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
      <p className="text-nowrap text-sm">
        {categoryName} {count && <span>({count})</span>}
      </p>
    </div>
  );
}
