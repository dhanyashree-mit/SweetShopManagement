import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
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
import type { Sweet } from "@shared/schema";

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

const categories = ['Chocolate', 'Gummies', 'Lollipops', 'Caramels', 'Hard Candy'];

export default function AdminPage({ user, onLogout, onNavigateShop }: AdminPageProps) {
  const [search, setSearch] = useState("");
  const [showSweetForm, setShowSweetForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: sweets = [], isLoading } = useQuery<Sweet[]>({
    queryKey: ['/api/sweets'],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; category: string; price: number; quantity: number }) => {
      const response = await apiRequest('POST', '/api/sweets', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sweets'] });
      setShowSweetForm(false);
      toast({
        title: "Sweet added",
        description: "New sweet has been added to inventory",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Could not add sweet",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<{ name: string; category: string; price: number; quantity: number }> }) => {
      const response = await apiRequest('PUT', `/api/sweets/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sweets'] });
      setShowSweetForm(false);
      setEditingSweet(null);
      toast({
        title: "Sweet updated",
        description: "Changes have been saved successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Could not update sweet",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/sweets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/sweets'] });
      setDeleteConfirm(null);
      toast({
        title: "Sweet deleted",
        description: "The sweet has been removed from inventory",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Could not delete sweet",
        variant: "destructive",
      });
    },
  });

  const totalProducts = sweets.length;
  const lowStockCount = sweets.filter(s => s.quantity > 0 && s.quantity <= 10).length;
  const outOfStockCount = sweets.filter(s => s.quantity === 0).length;
  const totalRevenue = useMemo(() => 
    sweets.reduce((sum, s) => sum + (s.price * Math.min(s.quantity, 10)), 0),
    [sweets]
  );

  const handleAddSweet = () => {
    setEditingSweet(null);
    setShowSweetForm(true);
  };

  const handleEditSweet = (id: string) => {
    const sweet = sweets.find(s => s.id.toString() === id);
    if (sweet) {
      setEditingSweet(sweet);
      setShowSweetForm(true);
    }
  };

  const handleDeleteSweet = (id: string) => {
    setDeleteConfirm(parseInt(id));
  };

  const confirmDelete = () => {
    if (deleteConfirm !== null) {
      deleteMutation.mutate(deleteConfirm);
    }
  };

  const handleSubmitSweet = (data: { name: string; category: string; price: number; quantity: number }) => {
    if (editingSweet) {
      updateMutation.mutate({ id: editingSweet.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const filteredSweets = sweets.filter(sweet =>
    sweet.name.toLowerCase().includes(search.toLowerCase())
  );

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

        {isLoading ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">Loading inventory...</p>
          </div>
        ) : sweetsWithImages.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground mb-2">No products found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search or add your first sweet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweetsWithImages.map(sweet => (
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
        sweet={editingSweet ? { ...editingSweet, id: editingSweet.id.toString(), image: getImageForSweet(editingSweet) } : null}
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