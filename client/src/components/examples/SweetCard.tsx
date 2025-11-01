import SweetCard from '../SweetCard';
import chocolateImage from '@assets/generated_images/Chocolate_truffles_product_photo_82108eff.png';

export default function SweetCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="max-w-sm">
        <SweetCard
          id="1"
          name="Chocolate Truffles"
          category="Chocolate"
          price={12.99}
          quantity={45}
          image={chocolateImage}
          onPurchase={(id) => console.log('Purchase clicked for:', id)}
        />
      </div>
    </div>
  );
}