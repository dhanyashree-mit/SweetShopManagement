import FilterPanel from '../FilterPanel';
import { useState } from 'react';

export default function FilterPanelExample() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);

  const categories = ['Chocolate', 'Gummies', 'Lollipops', 'Caramels', 'Hard Candy'];

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
    console.log('Categories:', checked ? [...selectedCategories, category] : selectedCategories.filter(c => c !== category));
  };

  return (
    <div className="p-8 bg-background">
      <div className="max-w-xs">
        <FilterPanel
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceRangeChange={(range) => {
            setPriceRange(range);
            console.log('Price range:', range);
          }}
          onReset={() => {
            setSelectedCategories([]);
            setPriceRange([0, 50]);
            console.log('Filters reset');
          }}
        />
      </div>
    </div>
  );
}