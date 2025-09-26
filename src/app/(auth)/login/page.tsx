import React from "react";
import Image from "next/image";
import LoginForm from "@/components/auth/login-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen min-w-screen grid grid-cols-2 w-full">
      <div className="relative bg-gray-900">
        <Image
          src="/login.webp"
          alt="Signup Background"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 p-12 flex flex-col justify-center h-full text-white">
          <div className="text-2xl font-light">Small Price</div>
          <div className="text-5xl font-bold mt-2">Big Experience</div>
          <div className="text-lg mt-8 max-w-sm">
            Unbox your way to lasting memories with OneNightBox.com
          </div>
        </div>
      </div>

      <div className="p-12 flex flex-col justify-center">
        <Image src="/logo.svg" height={200} width={200} alt="logo" />
        <h1 className="text-3xl font-bold mb-2">Login to your Account</h1>
        <p className="text-gray-600 mb-8">
          Top up your account and unbox your next trip!
        </p>
        <LoginForm />
      </div>
    </main>
  );
}