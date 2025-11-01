import { Card } from "@/components/ui/card";
import heroImage from "@assets/generated_images/Sweet_shop_interior_hero_4d20c827.png";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="font-serif text-6xl font-bold mb-4">Sweet Shop</h1>
          <p className="text-xl text-white/90">
            Discover premium handcrafted sweets and confections
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <Card className="w-full max-w-md p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
          {children}
        </Card>
      </div>
    </div>
  );
}