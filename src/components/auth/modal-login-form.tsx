"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

interface ModalLoginFormProps {
  onSuccess?: () => void;
}

const ModalLoginForm: React.FC<ModalLoginFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!email || !password) {
        setIsLoading(false);
        setError("Please fill out all fields");
        toast({ title: "Missing info", description: "Please fill out all fields.", variant: "destructive" });
        return;
      }

      console.log("Attempting login for:", email);
      const result = await login(email, password, rememberMe);
      console.log("Login result:", result);

      toast({
        title: "Welcome back!",
        description: "You're now signed in.",
        variant: "success",
        durationMs: 2500,
      });
      
      onSuccess?.();
    } catch (err) {
      let errorMessage = "An unexpected error occurred";
      
      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as any).message;
      }
      
      setError(errorMessage);
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle(`${window.location.origin}/`);
      toast({
        title: "Welcome!",
        description: "You're now signed in.",
        variant: "success",
      });
      onSuccess?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-in failed";
      setError(message);
      toast({
        title: "Google sign-in failed",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-3 animate-fade-in">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-2.5 text-sm"
        onClick={handleGoogleSignIn}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-card px-2 text-muted-foreground font-medium">OR SIGN IN WITH EMAIL</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium text-muted-foreground"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/70 size-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!error}
              className={`mt-1 h-9 pl-8 pr-9 text-sm ${error ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {error && <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />}
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="text-sm font-medium text-muted-foreground"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/70 size-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={!!error}
              className={`mt-1 h-9 pl-8 pr-20 text-sm ${error ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {error && <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />}
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-8 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-foreground transition-colors"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              className="h-4 w-4"
            />
            <Label htmlFor="remember" className="text-xs text-muted-foreground">
              Remember Me
            </Label>
          </div>
          <a href="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-9 text-sm transition-transform hover:scale-[1.01] active:scale-100 shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </div>
    </form>
  );
};

export default ModalLoginForm;
