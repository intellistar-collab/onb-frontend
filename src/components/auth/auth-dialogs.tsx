"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ModalLoginForm from "./modal-login-form";
import { ModalSignupForm } from "./modal-signup-form";

interface AuthDialogsProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "login" | "register";
}

export default function AuthDialogs({ isOpen, onClose, defaultTab = "login" }: AuthDialogsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl font-bold text-center">
            Welcome to OneNightBox
          </DialogTitle>
        </DialogHeader>

        <div className="w-full">
          {/* Login Form */}
          {activeTab === "login" && (
            <div className="space-y-3">
              <ModalLoginForm onSuccess={onClose} />
              
              {/* Sign up link */}
              <div className="text-center text-muted-foreground text-xs pt-1">
                Don't have an account?{" "}
                <button
                  onClick={() => setActiveTab("register")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <div className="space-y-3">
              <ModalSignupForm onSuccess={onClose} />
              
              {/* Sign in link */}
              <div className="text-center text-muted-foreground text-xs pt-1">
                Already have an account?{" "}
                <button
                  onClick={() => setActiveTab("login")}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
