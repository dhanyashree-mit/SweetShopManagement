import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface FilterPanelProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryChange: (category: string, checked: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  onReset: () => void;
  onClose?: () => void;
  isMobile?: boolean;
}

export default function FilterPanel({
  categories,
  selectedCategories,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  onReset,
  onClose,
  isMobile = false,
}: FilterPanelProps) {
  return (
    <Card className={`p-6 space-y-6 ${isMobile ? 'h-full' : 'sticky top-20'}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Filters</h3>
        {isMobile && onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} data-testid="button-close-filters">
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Category</Label>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onCheckedChange={(checked) => onCategoryChange(category, checked as boolean)}
                data-testid={`checkbox-category-${category.toLowerCase()}`}
              />
              <label
                htmlFor={`category-${category}`}
                className="text-sm cursor-pointer"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">
          Price Range: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={50}
          step={1}
          value={priceRange}
          onValueChange={(value) => onPriceRangeChange(value as [number, number])}
          data-testid="slider-price-range"
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={onReset}
        data-testid="button-reset-filters"
      >
        Reset Filters
      </Button>
    </Card>
  );
}