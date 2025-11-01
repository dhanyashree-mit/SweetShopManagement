import { useState } from "react";
import Header from "@/components/Header";
import StatCard from "@/components/StatCard";
import SweetCard from "@/components/SweetCard";
import SweetForm from "@/components/SweetForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Package, 
  AlertTriangle, 
  ShoppingCart, 
  DollarSign,
  Plus,
  Search,
  ArrowLeft
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// TODO: Remove mock data
import chocolateImage from '@assets/generated_images/Chocolate_truffles_product_photo_82108eff.png';
import gummiesImage from '@assets/generated_images/Gummy_bears_product_photo_97cd724e.png';
import lollipopsImage from '@assets/generated_images/Lollipops_product_photo_03dfa45d.png';
import caramelsImage from '@assets/generated_images/Caramel_candies_product_photo_d486651a.png';
import hardCandyImage from '@assets/generated_images/Hard_candies_product_photo_cffa7db0.png';
import chocolateAlmondsImage from '@assets/generated_images/Chocolate_almonds_product_photo_2ccdf818.png';

interface AdminPageProps {
  user: { username: string; isAdmin: boolean };
  onLogout: () => void;
  onNavigateShop: () => void;
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

export default function AdminPage({ user, onLogout, onNavigateShop }: AdminPageProps) {
  const [sweets, setSweets] = useState(mockSweets);
  const [search, setSearch] = useState("");
  const [showSweetForm, setShowSweetForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<typeof mockSweets[0] | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const { toast } = useToast();

  // TODO: Remove mock calculations
  const totalProducts = sweets.length;
  const lowStockCount = sweets.filter(s => s.quantity > 0 && s.quantity <= 10).length;
  const outOfStockCount = sweets.filter(s => s.quantity === 0).length;
  const totalRevenue = sweets.reduce((sum, s) => sum + (s.price * 10), 0); // Mock sales

  const handleAddSweet = () => {
    setEditingSweet(null);
    setShowSweetForm(true);
  };

  const handleEditSweet = (id: string) => {
    const sweet = sweets.find(s => s.id === id);
    if (sweet) {
      setEditingSweet(sweet);
      setShowSweetForm(true);
    }
  };

  const handleDeleteSweet = (id: string) => {
    setDeleteConfirm(id);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      // TODO: Remove mock functionality - replace with actual API call
      setSweets(sweets.filter(s => s.id !== deleteConfirm));
      toast({
        title: "Sweet deleted",
        description: "The sweet has been removed from inventory",
      });
      setDeleteConfirm(null);
    }
  };

  const handleSubmitSweet = (data: Omit<typeof mockSweets[0], 'id' | 'image'>) => {
    if (editingSweet) {
      // TODO: Remove mock functionality - replace with actual API call
      setSweets(sweets.map(s => 
        s.id === editingSweet.id 
          ? { ...s, ...data }
          : s
      ));
      toast({
        title: "Sweet updated",
        description: "Changes have been saved successfully",
      });
    } else {
      // TODO: Remove mock functionality - replace with actual API call
      const newSweet = {
        ...data,
        id: String(sweets.length + 1),
        image: chocolateImage, // Default image
      };
      setSweets([...sweets, newSweet]);
      toast({
        title: "Sweet added",
        description: "New sweet has been added to inventory",
      });
    }
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onLogout={onLogout}
        onNavigate={(path) => {
          if (path === '/') onNavigateShop();
        }}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onNavigateShop}
            data-testid="button-back-to-shop"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your sweet inventory and sales</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Products"
            value={totalProducts}
            icon={Package}
            description="Active in inventory"
          />
          <StatCard
            title="Low Stock"
            value={lowStockCount}
            icon={AlertTriangle}
            description="Need restocking"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockCount}
            icon={ShoppingCart}
            description="Currently unavailable"
          />
          <StatCard
            title="Revenue"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            description="Total sales"
            trend={{ value: 12, isPositive: true }}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search inventory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 h-12"
              data-testid="input-admin-search"
            />
          </div>
          <Button onClick={handleAddSweet} data-testid="button-add-sweet">
            <Plus className="w-4 h-4 mr-2" />
            Add New Sweet
          </Button>
        </div>

        {filteredSweets.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSweets.map(sweet => (
              <SweetCard
                key={sweet.id}
                {...sweet}
                isAdmin
                onEdit={handleEditSweet}
                onDelete={handleDeleteSweet}
              />
            ))}
          </div>
        )}
      </div>

      <SweetForm
        open={showSweetForm}
        onClose={() => setShowSweetForm(false)}
        sweet={editingSweet}
        onSubmit={handleSubmitSweet}
        categories={categories}
      />

      <AlertDialog open={deleteConfirm !== null} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the sweet from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} data-testid="button-confirm-delete">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}