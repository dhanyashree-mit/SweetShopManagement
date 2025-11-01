import AuthLayout from '../AuthLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthLayoutExample() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your account to continue">
      <form className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button className="w-full">Sign In</Button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account? <a href="#" className="text-primary font-medium">Sign up</a>
        </p>
      </form>
    </AuthLayout>
  );
}