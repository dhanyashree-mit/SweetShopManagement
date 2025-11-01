import { useState } from "react";
import { useAuth } from "@/lib/auth";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface RegisterPageProps {
  onNavigateLogin: () => void;
}

export default function RegisterPage({ onNavigateLogin }: RegisterPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(username, password, isAdmin);
      toast({
        title: "Registration successful",
        description: "Your account has been created!",
      });
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join our sweet community today"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
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
            placeholder="Create a password"
            required
            data-testid="input-password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            required
            data-testid="input-confirm-password"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox 
            id="admin" 
            checked={isAdmin}
            onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
            data-testid="checkbox-admin"
          />
          <label
            htmlFor="admin"
            className="text-sm cursor-pointer"
          >
            Register as Admin
          </label>
        </div>

        <Button type="submit" className="w-full" data-testid="button-register" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Create Account"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-primary font-medium hover:underline"
            data-testid="link-login"
          >
            Sign in
          </button>
        </p>
      </form>
    </AuthLayout>
  );
}