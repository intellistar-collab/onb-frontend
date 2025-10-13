import React from "react";
import Image from "next/image";
import { SignupForm } from "@/components/auth/signup-form";
import { PublicRoute } from "@/components/auth/auth-guard";

export default function SignupPage() {
  return (
    <PublicRoute>
      <main className="min-h-screen w-full">
      {/* Desktop Layout */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:min-h-screen">
        <div className="relative bg-gray-900 lg:col-span-7">
          <Image
            src="/hero.webp"
            alt="Signup Background"
            fill
            className="object-cover opacity-40"
          />
          <div className="relative z-10 p-12 lg:p-16 flex flex-col justify-center h-full text-white max-w-xl">
            <div className="text-2xl font-light">Small Price</div>
            <div className="text-5xl font-bold mt-2">Big Experience</div>
            <div className="text-lg mt-8 max-w-sm">
              Unbox your way to lasting memories with OneNightBox.com
            </div>
          </div>
        </div>

        <div className="p-12 flex flex-col justify-center lg:col-span-5">
          <div className="w-full max-w-md mx-auto rounded-xl border border-border bg-card/60 backdrop-blur p-10 shadow-lg animate-scale-in">
            <div className="text-center mb-8">
              <Image src="/logo.svg" height={160} width={160} alt="logo" className="mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2 text-foreground">Create your Account</h1>
              <p className="text-muted-foreground">
                Top up your account and unbox your next trip!
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen flex flex-col">
        {/* Mobile Header with Background */}
        <div className="relative bg-gray-900 h-48 sm:h-56">
          <Image
            src="/hero.webp"
            alt="Signup Background"
            fill
            className="object-cover opacity-40"
          />
          <div className="relative z-10 p-6 flex flex-col justify-center h-full text-white">
            <div className="text-lg sm:text-xl font-light">Small Price</div>
            <div className="text-3xl sm:text-4xl font-bold mt-1">Big Experience</div>
            <div className="text-sm sm:text-base mt-4">
              Unbox your way to lasting memories with OneNightBox.com
            </div>
          </div>
        </div>

        {/* Mobile Form Section */}
        <div className="flex-1 p-6 sm:p-8 bg-background">
          <div className="max-w-md mx-auto rounded-xl border border-border bg-card/60 backdrop-blur p-6 sm:p-8 shadow-lg animate-fade-in-up">
            <div className="text-center mb-8">
              <Image src="/logo.svg" height={120} width={120} alt="logo" className="mx-auto mb-4" />
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">Create your Account</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Top up your account and unbox your next trip!
              </p>
            </div>
            <SignupForm />
          </div>
        </div>
      </div>
      </main>
    </PublicRoute>
  );
}