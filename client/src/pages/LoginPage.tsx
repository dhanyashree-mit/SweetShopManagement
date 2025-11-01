import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onLogin: (username: string, isAdmin: boolean) => void;
  onNavigateRegister: () => void;
}

export default function LoginPage({ onLogin, onNavigateRegister }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Remove mock functionality - replace with actual API call
    if (username && password) {
      const isAdmin = username.toLowerCase().includes('admin');
      onLogin(username, isAdmin);
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
    }
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue shopping"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            data-testid="input-username"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            data-testid="input-password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="remember" data-testid="checkbox-remember" />
          <label
            htmlFor="remember"
            className="text-sm cursor-pointer"
          >
            Remember me
          </label>
        </div>

        <Button type="submit" className="w-full" data-testid="button-login">
          Sign In
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={onNavigateRegister}
            className="text-primary font-medium hover:underline"
            data-testid="link-register"
          >
            Sign up
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}