import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface PurchaseModalProps {
  open: boolean;
  onClose: () => void;
  sweet: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  } | null;
  onConfirm: (sweetId: string, quantity: number) => void;
}

export default function PurchaseModal({ open, onClose, sweet, onConfirm }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!sweet) return null;

  const handleConfirm = () => {
    onConfirm(sweet.id, quantity);
    setQuantity(1);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < sweet.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const total = sweet.price * quantity;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {sweet.name}</DialogTitle>
          <DialogDescription>
            Select the quantity you'd like to purchase
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="flex gap-4">
            <img 
              src={sweet.image} 
              alt={sweet.name}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-lg">{sweet.name}</h4>
              <p className="text-2xl font-bold text-primary">${sweet.price.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">{sweet.quantity} in stock</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                data-testid="button-decrease-quantity"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(sweet.quantity, parseInt(e.target.value) || 1)))}
                className="text-center"
                data-testid="input-quantity"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= sweet.quantity}
                data-testid="button-increase-quantity"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <span className="font-medium">Total</span>
            <span className="text-2xl font-bold text-primary" data-testid="text-total-price">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel-purchase">
            Cancel
          </Button>
          <Button onClick={handleConfirm} data-testid="button-confirm-purchase">
            Confirm Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}