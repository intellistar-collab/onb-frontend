"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/toast";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

// Zod validation schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your password"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const { toast } = useToast();
  const { signup, signupWithGoogle } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      acceptTerms: false,
    },
  });

  const acceptTerms = watch("acceptTerms");
  const passwordValue = watch("password") || "";

  const onSubmit = async (data: SignupFormData) => {
    try {
      await signup(data.email, data.password, data.username);

      toast({ 
        title: "Welcome!", 
        description: "Your account has been created successfully. Redirecting to login...", 
        variant: "success", 
        durationMs: 3000 
      });
      // Redirect to login page after successful signup
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed";
      toast({ 
        title: "Could not create account", 
        description: message, 
        variant: "destructive" 
      });
    }
  };

  const onInvalid = (formErrors: any) => {
    const firstMessage =
      formErrors?.email?.message ||
      formErrors?.password?.message ||
      formErrors?.confirmPassword?.message ||
      formErrors?.username?.message ||
      formErrors?.acceptTerms?.message ||
      "Please check the highlighted fields.";
    toast({ title: "Check your details", description: firstMessage, variant: "destructive" });
  };

  const getPasswordStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p) || /[^A-Za-z0-9]/.test(p)) score++;
    return score; // 0..3
  };
  const strength = getPasswordStrength(passwordValue);

  const handleGoogleSignup = async () => {
    try {
      await signupWithGoogle(`${window.location.origin}/`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Google sign-up failed";
      toast({ 
        title: "Google sign-up failed", 
        description: message, 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      {/* Google Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full py-3 sm:py-4 flex items-center justify-center space-x-3 text-sm sm:text-base"
        onClick={handleGoogleSignup}
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Continue with Google</span>
      </Button>

      {/* Divider */}
      <div className="flex items-center">
        <Separator className="flex-1" />
        <span className="px-2 sm:px-4 text-xs sm:text-sm text-muted-foreground">
          or Sign up with Email
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-muted-foreground"
        >
          Username
        </label>
        <div className="relative">
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            aria-invalid={!!errors.username}
            className={`h-10 sm:h-11 pr-9 text-sm sm:text-base ${
              errors.username ? "border-red-500 focus:ring-red-500" : ""
            }`}
            {...register("username")}
          />
          {errors.username && (
            <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />
          )}
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-muted-foreground"
        >
          Email
        </label>
        <div className="relative">
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className={`h-10 sm:h-11 pr-9 text-sm sm:text-base ${
              errors.email ? "border-red-500 focus:ring-red-500" : ""
            }`}
            {...register("email")}
          />
          {errors.email && (
            <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-muted-foreground"
        >
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            aria-invalid={!!errors.password}
            className={`h-10 sm:h-11 pr-9 text-sm sm:text-base ${
              errors.password ? "border-red-500 focus:ring-red-500" : ""
            }`}
            {...register("password")}
          />
          {errors.password && (
            <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />
          )}
        </div>
        <div className="h-1.5 rounded-full bg-border overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              strength === 0 ? "w-0" : strength === 1 ? "w-1/3 bg-red-500/70" : strength === 2 ? "w-2/3 bg-yellow-500/70" : "w-full bg-emerald-500/70"
            }`}
          />
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-muted-foreground"
        >
          Confirm Password
        </label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            aria-invalid={!!errors.confirmPassword}
            className={`h-10 sm:h-11 pr-9 text-sm sm:text-base ${
              errors.confirmPassword ? "border-red-500 focus:ring-red-500" : ""
            }`}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <AlertCircle className="absolute right-2 top-1/2 -translate-y-1/2 text-red-400 size-4" />
          )}
        </div>
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className={`flex items-start space-x-3 ${errors.acceptTerms ? "ring-1 ring-red-500/50 rounded-md p-2" : ""}`}>
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) =>
            setValue("acceptTerms", !!checked)
          }
          className="mt-1 h-4 w-4"
        />
        <div className="flex-1">
          <label
            htmlFor="acceptTerms"
            className="text-xs sm:text-sm text-muted-foreground cursor-pointer"
          >
            I accept the{" "}
            <a
              href="/terms-and-condition"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy-policy"
              className="text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </a>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit(onSubmit, onInvalid)}
        disabled={isSubmitting}
        className="w-full py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base hover:scale-[1.01] active:scale-100"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Account...</span>
          </div>
        ) : (
          "Sign Up"
        )}
      </Button>

      {/* Login Link */}
      <div className="text-center text-muted-foreground text-xs sm:text-sm">
        Already have an account?{" "}
        <a href="/login" className="text-primary hover:underline">
          Sign In
        </a>
      </div>
    </div>
  );
}
