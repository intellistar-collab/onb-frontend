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
import { useRouter, useSearchParams } from "next/navigation";
import ContinueWithGoogle from "./continue-with-google";

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

  const onSubmit = async (data: SignupFormData) => {
    const resp = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      username: data.username,
      name: "",
      callbackURL: "http://localhost:3000/",
    });

    if (resp.error) {
      console.log(resp.error);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="space-y-6">
      <ContinueWithGoogle />

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
