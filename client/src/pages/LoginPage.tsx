import { useState } from "react";
import { useAuth } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface LoginPageProps {
  onNavigateRegister: () => void;
}

export default function LoginPage({ onNavigateRegister }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(username, password);
      toast({
        title: "Login successful",
        description: `Welcome back, ${username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            placeholder="Enter your password"
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

        <Button type="submit" className="w-full" data-testid="button-login" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
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