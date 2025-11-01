import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Edit, Trash2 } from "lucide-react";

interface SweetCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  image: string;
  isAdmin?: boolean;
  onPurchase?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function SweetCard({
  id,
  name,
  category,
  price,
  quantity,
  image,
  isAdmin = false,
  onPurchase,
  onEdit,
  onDelete,
}: SweetCardProps) {
  const isOutOfStock = quantity === 0;
  const isLowStock = quantity > 0 && quantity <= 10;

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200">
      <div className="relative aspect-square">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        <Badge 
          className="absolute top-4 right-2"
          variant={isOutOfStock ? "secondary" : "default"}
        >
          {category}
        </Badge>
      </div>

      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">{name}</h3>
          <p className="text-3xl font-bold text-primary">
            ${price.toFixed(2)}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Stock</span>
            <span className={`font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-chart-2' : 'text-foreground'}`}>
              {quantity} units
            </span>
          </div>
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all ${isOutOfStock ? 'bg-destructive' : isLowStock ? 'bg-chart-2' : 'bg-primary'}`}
              style={{ width: `${Math.min((quantity / 100) * 100, 100)}%` }}
            />
          </div>
        </div>

        {isAdmin ? (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onEdit?.(id)}
              data-testid={`button-edit-${id}`}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => onDelete?.(id)}
              data-testid={`button-delete-${id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            disabled={isOutOfStock}
            onClick={() => onPurchase?.(id)}
            data-testid={`button-purchase-${id}`}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isOutOfStock ? 'Out of Stock' : 'Purchase'}
          </Button>
        )}
      </div>
    </Card>
  );
}