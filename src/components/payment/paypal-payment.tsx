"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, X, ExternalLink } from 'lucide-react';

interface PayPalPaymentProps {
  redirectUrl: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  redirectUrl,
  amount,
  currency,
  onSuccess,
  onError,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      // Open PayPal in new window
      const paypalWindow = window.open(
        redirectUrl,
        'paypal-payment',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!paypalWindow) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Monitor the popup window
      const checkClosed = setInterval(() => {
        if (paypalWindow.closed) {
          clearInterval(checkClosed);
          setIsProcessing(false);
          
          // In a real implementation, you would check the payment status
          // For now, we'll simulate success after a delay
          setTimeout(() => {
            setIsCompleted(true);
            onSuccess();
          }, 2000);
        }
      }, 1000);

    } catch (err: any) {
      const errorMessage = err.message || 'PayPal payment failed';
      setError(errorMessage);
      onError(errorMessage);
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
            <span className="text-white">PayPal</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Provider:</span>
            <span className="text-white">PayPal</span>
          </div>
        </div>
      </div>

      {/* PayPal Info */}
      <div className="p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg">
        <div className="flex items-center gap-2 text-blue-300 text-sm">
          <span className="font-medium">PayPal Payment:</span>
          <span>You will be redirected to PayPal</span>
        </div>
        <div className="text-blue-200 text-xs mt-1">
          Complete your payment securely on PayPal's platform
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
        onClick={handlePayPalPayment}
        disabled={isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Opening PayPal...
          </>
        ) : (
          <>
            <ExternalLink className="w-5 h-5 mr-2" />
            Pay with PayPal ${amount} {currency.toUpperCase()}
          </>
        )}
      </Button>

      {/* Security Notice */}
      <div className="text-xs text-gray-400 text-center">
        🔒 Your payment is secured by PayPal
      </div>
    </div>
  );
};

export default PayPalPayment;
