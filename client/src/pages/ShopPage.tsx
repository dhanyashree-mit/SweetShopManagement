import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import SweetCard from "@/components/SweetCard";
import PurchaseModal from "@/components/PurchaseModal";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// TODO: Remove mock data
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

// TODO: Remove mock data
const mockSweets = [
  { id: '1', name: 'Chocolate Truffles', category: 'Chocolate', price: 12.99, quantity: 45, image: chocolateImage },
  { id: '2', name: 'Gummy Bears', category: 'Gummies', price: 5.99, quantity: 120, image: gummiesImage },
  { id: '3', name: 'Rainbow Lollipops', category: 'Lollipops', price: 3.99, quantity: 8, image: lollipopsImage },
  { id: '4', name: 'Caramel Delights', category: 'Caramels', price: 8.99, quantity: 0, image: caramelsImage },
  { id: '5', name: 'Fruit Hard Candies', category: 'Hard Candy', price: 6.49, quantity: 85, image: hardCandyImage },
  { id: '6', name: 'Chocolate Almonds', category: 'Chocolate', price: 15.99, quantity: 32, image: chocolateAlmondsImage },
];

const categories = ['Chocolate', 'Gummies', 'Lollipops', 'Caramels', 'Hard Candy'];

export default function ShopPage({ user, onLogout, onNavigateAdmin }: ShopPageProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50]);
  const [selectedSweet, setSelectedSweet] = useState<typeof mockSweets[0] | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const { toast } = useToast();

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
    const sweet = mockSweets.find(s => s.id === sweetId);
    if (sweet) {
      setSelectedSweet(sweet);
      setShowPurchaseModal(true);
    }
  };

  const handleConfirmPurchase = (sweetId: string, quantity: number) => {
    // TODO: Remove mock functionality - replace with actual API call
    console.log('Purchase confirmed:', { sweetId, quantity });
    toast({
      title: "Purchase successful!",
      description: `You've purchased ${quantity} item(s)`,
    });
  };

  // Filter sweets based on search, categories, and price
  const filteredSweets = mockSweets.filter(sweet => {
    const matchesSearch = sweet.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(sweet.category);
    const matchesPrice = sweet.price >= priceRange[0] && sweet.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

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
            {filteredSweets.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-xl text-muted-foreground mb-2">No sweets found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters or search</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSweets.map(sweet => (
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
        sweet={selectedSweet}
        onConfirm={handleConfirmPurchase}
      />
    </div>
  );
}