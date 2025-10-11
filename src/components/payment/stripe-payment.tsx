"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, X } from 'lucide-react';

interface StripePaymentProps {
  clientSecret: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const StripePayment: React.FC<StripePaymentProps> = ({
  clientSecret,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Load Stripe
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: 'Test User', // In production, get from user profile
            },
          },
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message || 'Payment failed');
      }

      // Payment succeeded
      setIsCompleted(true);
      onSuccess();
    } catch (err: any) {
      const errorMessage = err.message || 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
        <div className="flex items-center gap-2 text-green-300">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Payment Successful!</span>
        </div>
        <p className="text-green-200 text-sm mt-1">
          ${amount} {currency.toUpperCase()} has been added to your account.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Payment Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Amount:</span>
            <span className="text-white font-medium">${amount} {currency.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Payment Method:</span>
            <span className="text-white">Credit Card</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Provider:</span>
            <span className="text-white">Stripe</span>
          </div>
        </div>
      </div>

      {/* Test Card Info */}
      <div className="p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-300 text-sm">
          <span className="font-medium">Test Mode:</span>
          <span>Use card 4242 4242 4242 4242</span>
        </div>
        <div className="text-blue-200 text-xs mt-1">
          Expiry: 12/25 | CVV: 123
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          <div className="flex items-center gap-2">
            <X className="w-4 h-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Pay Button */}
      <Button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing Payment...
          </>
        ) : (
          `Pay $${amount} ${currency.toUpperCase()}`
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-xs text-gray-400 text-center">
        🔒 Your payment is secured by Stripe
      </div>
    </div>
  );
};

export default StripePayment;
