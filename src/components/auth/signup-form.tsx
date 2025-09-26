"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/auth-client";

// Zod validation schema
const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
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

  const onSubmit = async (data: SignupFormData) => {
    // Simulate API call
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Account created successfully!");
  };

  const handleGoogleSignup = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="space-y-6">
      {/* Google Sign Up Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full py-3 flex items-center justify-center space-x-3 border-gray-300 hover:bg-gray-50"
        onClick={handleGoogleSignup}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
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
        <span className="px-4 text-sm text-gray-500">
          or Sign up with Email
        </span>
        <Separator className="flex-1" />
      </div>

      {/* Username Field */}
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="text-sm font-medium text-gray-700"
        >
          Username
        </label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your username"
          className={`${
            errors.username ? "border-red-500 focus:ring-red-500" : ""
          }`}
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-red-600">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className={`${
            errors.email ? "border-red-500 focus:ring-red-500" : ""
          }`}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="password"
          className="text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          className={`${
            errors.password ? "border-red-500 focus:ring-red-500" : ""
          }`}
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* Terms and Conditions Checkbox */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="acceptTerms"
          checked={acceptTerms}
          onCheckedChange={(checked) =>
            setValue("acceptTerms", !!checked)
          }
          className="mt-1"
        />
        <div className="flex-1">
          <label
            htmlFor="acceptTerms"
            className="text-sm text-gray-600 cursor-pointer"
          >
            I accept the{" "}
            <a
              href="#"
              className="text-pink-500 hover:text-pink-600 underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-pink-500 hover:text-pink-600 underline"
            >
              Privacy Policy
            </a>
          </label>
          {errors.acceptTerms && (
            <p className="text-sm text-red-600 mt-1">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
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
    </div>
  );
}
