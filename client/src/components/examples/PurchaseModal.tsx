import PurchaseModal from '../PurchaseModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import chocolateImage from '@assets/generated_images/Chocolate_truffles_product_photo_82108eff.png';

export default function PurchaseModalExample() {
  const [open, setOpen] = useState(false);

  const sweet = {
    id: '1',
    name: 'Chocolate Truffles',
    price: 12.99,
    quantity: 45,
    image: chocolateImage,
  };

  return (
    <div className="p-8 bg-background">
      <Button onClick={() => setOpen(true)}>Open Purchase Modal</Button>
      <PurchaseModal
        open={open}
        onClose={() => setOpen(false)}
        sweet={sweet}
        onConfirm={(id, qty) => {
          console.log('Purchase confirmed:', id, qty);
          setOpen(false);
        }}
      />
    </div>
  );
}