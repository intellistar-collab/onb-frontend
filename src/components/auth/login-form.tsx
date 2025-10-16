"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/toast";
import { Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

const LoginForm = () => {
  const { toast } = useToast();
  const { login, loginWithGoogle, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Lightweight client-side validation for better UX
      if (!email || !password) {
        setIsLoading(false);
        setError("Please fill out all fields");
        toast({ title: "Missing info", description: "Please fill out all fields.", variant: "destructive" });
        return;
      }

      console.log("Attempting login for:", email);
      const result = await login(email, password, rememberMe);
      console.log("Login result:", result);

      // Wait longer for auth state to update in production
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check user role and redirect accordingly
      const userRole = (result.data?.user as any)?.role;
      const redirectParam = searchParams.get('redirect') || null;      
      let redirectTo = redirectParam || '/';
      
      // If user is ADMIN and no specific redirect, go to admin dashboard
      if (userRole === 'ADMIN' && !redirectParam) {
        redirectTo = '/admin/dashboard';
        console.log("Admin user, redirecting to dashboard:", redirectTo);
      }
      
      toast({
        title: "Welcome back!",
        description: userRole === 'ADMIN' ? "Welcome back, Admin!" : "You're now signed in.",
        variant: "success",
        durationMs: 2000,
      });
      
      console.log("Redirecting to:", redirectTo);
      router.push(redirectTo);
    } catch (err) {
      // Extract error message from the error object
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
      const redirectTo = searchParams.get('redirect') || '/';
      
      // For Google sign-in, we'll handle role-based redirect after successful authentication
      // The redirect will be processed by the callback URL
      await loginWithGoogle(`${window.location.origin}${redirectTo}`);
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
      <form noValidate onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 animate-fade-in">
      <Button
        type="button"
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 text-sm sm:text-base"
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
        <div className="relative flex justify-center text-xs sm:text-sm">
          <span className="bg-card px-2 sm:px-3 text-muted-foreground font-medium">OR SIGN IN WITH EMAIL</span>
        </div>
      </div>

      {/* Inline error block removed; toasts handle messaging. Keep subtle field feedback below. */}

      <div className="space-y-3 sm:space-y-4">
        <div>
          <Label htmlFor="email" className="text-muted-foreground text-sm sm:text-base">
            Email
          </Label>
          <div className="relative">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/70 size-4" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-invalid={!!error}
              className={`mt-1 h-10 sm:h-11 pl-8 pr-9 text-sm sm:text-base ${error ? "border-red-500 focus:ring-red-500" : ""}`}
            />
            {error && <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />}
          </div>
        </div>

        <div>
          <Label htmlFor="password" className="text-muted-foreground text-sm sm:text-base">
            Password
          </Label>
          <div className="relative">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground/70 size-4" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-invalid={!!error}
              className={`mt-1 h-10 sm:h-11 pl-8 pr-20 text-sm sm:text-base ${error ? "border-red-500 focus:ring-red-500" : ""}`}
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
            <Label htmlFor="remember" className="text-xs sm:text-sm text-muted-foreground">
              Remember Me
            </Label>
          </div>
          <a href="/forgot-password" className="text-xs sm:text-sm text-primary hover:underline">
            Forgot Password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-10 sm:h-11 text-sm sm:text-base transition-transform hover:scale-[1.01] active:scale-100 shadow-lg"
          disabled={isLoading || authLoading}
        >
          {authLoading ? "Loading..." : isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </div>

      <div className="text-center text-muted-foreground text-xs sm:text-sm">
        Not Registered Yet?{" "}
        <a href="/signup" className="text-primary hover:underline">
          Create an Account
        </a>
      </div>
    </form>
  );
};

export default LoginForm;
