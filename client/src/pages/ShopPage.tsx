import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import SweetCard from "@/components/SweetCard";
import PurchaseModal from "@/components/PurchaseModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Sweet } from "@shared/schema";

import chocolateImage from '@assets/generated_images/Chocolate_truffles_product_photo_82108eff.png';
import gummiesImage from '@assets/generated_images/Gummy_bears_product_photo_97cd724e.png';
import lollipopsImage from '@assets/generated_images/Lollipops_product_photo_03dfa45d.png';
import caramelsImage from '@assets/generated_images/Caramel_candies_product_photo_d486651a.png';
import hardCandyImage from '@assets/generated_images/Hard_candies_product_photo_cffa7db0.png';
import chocolateAlmondsImage from '@assets/generated_images/Chocolate_almonds_product_photo_2ccdf818.png';

interface ShopPageProps {
  user: { username: string; isAdmin: boolean };
  onLogout: () => void;
  onNavigateAdmin: () => void;
}

const imageMap: Record<string, string> = {
  'Chocolate Truffles': chocolateImage,
  'Gummy Bears': gummiesImage,
  'Rainbow Lollipops': lollipopsImage,
  'Caramel Delights': caramelsImage,
  'Fruit Hard Candies': hardCandyImage,
  'Chocolate Almonds': chocolateAlmondsImage,
  'Chocolate': chocolateImage,
  'Gummies': gummiesImage,
  'Lollipops': lollipopsImage,
  'Caramels': caramelsImage,
  'Hard Candy': hardCandyImage,
};

function getImageForSweet(sweet: Sweet): string {
  return imageMap[sweet.name] || imageMap[sweet.category] || chocolateImage;
}

export default function ShopPage({ user, onLogout, onNavigateAdmin }: ShopPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { toast } = useToast();

  const { data: sweets = [], isLoading } = useQuery<Sweet[]>({
    queryKey: ['/api/sweets'],
  });

  const purchaseMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      const response = await apiRequest('POST', `/api/sweets/${id}/purchase`, { quantity });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sweets'] });
      setShowPurchaseModal(false);
      toast({
        title: "Purchase successful!",
        description: `Your purchase has been completed`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Purchase failed",
        description: error.message || "Could not complete purchase",
        variant: "destructive",
      });
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(sweets.map(s => s.category));
    return Array.from(uniqueCategories);
  }, [sweets]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 50]);
    setSearch("");
  };

  const handlePurchase = (sweetId: string) => {
    const sweet = sweets.find(s => s.id.toString() === sweetId);
    if (sweet) {
      setSelectedSweet(sweet);
      setShowPurchaseModal(true);
    }
  };

  const handleConfirmPurchase = (sweetId: string, quantity: number) => {
    purchaseMutation.mutate({ id: parseInt(sweetId), quantity });
  };

  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(sweet.category);
    const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sweetsWithImages = filteredSweets.map(sweet => ({
    ...sweet,
    id: sweet.id.toString(),
    image: getImageForSweet(sweet),
  }));

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onLogout={onLogout}
        onNavigate={(path) => {
          if (path === '/admin') onNavigateAdmin();
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold mb-2">Sweet Collection</h1>
              <p className="text-muted-foreground">Discover our delightful selection of handcrafted treats</p>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden" data-testid="button-filters">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <div className="p-6">
                  <FilterPanel
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    onReset={handleResetFilters}
                    onClose={() => {}}
                    isMobile
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <FilterPanel
              categories={categories}
              selectedCategories={selectedCategories}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              onReset={handleResetFilters}
            />
          </aside>

          <main className="flex-1">
            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground">Loading sweets...</p>
              </div>
            ) : sweetsWithImages.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-2">No sweets found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sweetsWithImages.map(sweet => (
                  <SweetCard
                    key={sweet.id}
                    {...sweet}
                    onPurchase={handlePurchase}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <PurchaseModal
        open={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        sweet={selectedSweet ? { ...selectedSweet, id: selectedSweet.id.toString(), image: getImageForSweet(selectedSweet) } : null}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  );
}