import { useCatalogFilter } from '../../contexts/catalogFilterContext';

import './Categories.scoped.scss';

interface CategoriesProps {
  wineTypes: string[];
}

export default function Categories({ wineTypes }: CategoriesProps) {
  const { filter, setFilter } = useCatalogFilter();

  const onCategoryClick = (wineType: string) => {
    setFilter({
      ...filter,
      wine_type: [wineType],
    });
  };

  return (
    <div className="categories-wrapper">
      <div className="catalog-btn">Каталог</div>
      <div className="categories">
        {wineTypes.map((wineType) => {
          return (
            <div key={wineType}
              className={`category ${wineType === filter.wine_type?.[0] ? 'category-selected': ''}`}
              onClick={() => onCategoryClick(wineType)}
            >
              <div>{wineType}</div>
              <div>&gt;</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
