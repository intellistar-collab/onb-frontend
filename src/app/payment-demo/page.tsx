"use client";

import React, { useState } from "react";
import PaymentDialog from "@/components/payment/payment-dialog";
import { Button } from "@/components/ui/button";

const PaymentDemoPage = () => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white mb-8">
          Payment Dialog Demo
        </h1>
        
        <div className="space-y-4">
          <p className="text-gray-300 text-lg">
            Click the button below to open the payment dialog
          </p>
          
          <Button
            onClick={() => setIsPaymentDialogOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
          >
            Add Funds to Account
          </Button>
        </div>

        <div className="mt-12 text-left max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-white mb-4">Features:</h2>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Crypto payment methods (Bitcoin, Ethereum, USDT, Litecoin)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Fiat payment methods (Credit Card, PayPal, Bank Transfer)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              QR code display for crypto deposits
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Wallet address copying functionality
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Payment form for fiat methods
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              Dark theme matching the original design
            </li>
          </ul>
        </div>
      </div>

      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
      />
    </div>
  );
};

export default PaymentDemoPage;
