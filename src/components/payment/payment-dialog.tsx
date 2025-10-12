"use client";

import React, { useState } from "react";
import { X, Copy, CheckCircle, Dot, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import QRCode from "./qr-code";
import StripePayment from "./stripe-payment";
import PayPalPayment from "./paypal-payment";
import BankTransfer from "./bank-transfer";
import { paymentApi, CreateCryptoPaymentRequest, CreateFiatPaymentRequest } from "@/lib/payment-api";
import { usePaymentStatus } from "./use-payment-status";

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type PaymentMethod = 'crypto' | 'fiat';
type CryptoMethod = 'bitcoin' | 'ethereum' | 'usdt' | 'litecoin';
type FiatMethod = 'card' | 'paypal' | 'bank';

const PaymentDialog: React.FC<PaymentDialogProps> = ({ isOpen, onClose }) => {
  const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentMethod>('crypto');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoMethod>('usdt');
  const [selectedFiat, setSelectedFiat] = useState<FiatMethod>('card');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPayment, setCurrentPayment] = useState<any>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [showPayPalPayment, setShowPayPalPayment] = useState(false);
  const [showBankTransfer, setShowBankTransfer] = useState(false);
  const [amount, setAmount] = useState(100);

  // Real-time payment status polling
  const { status, isCompleted, isFailed, isPending, error: statusError } = usePaymentStatus({
    paymentId,
    enabled: !!paymentId,
  });

  const cryptoMethods = [
    { id: 'usdt', name: 'Tether', icon: 'T', color: 'bg-green-500', network: 'Tron (TRC-20)' },
    { id: 'bitcoin', name: 'Bitcoin', icon: 'B', color: 'bg-orange-500', network: 'Bitcoin' },
    { id: 'ethereum', name: 'Ethereum', icon: 'Ξ', color: 'bg-purple-500', network: 'Ethereum' },
    { id: 'litecoin', name: 'Litecoin', icon: 'L', color: 'bg-gray-500', network: 'Litecoin' },
  ];

  const fiatMethods = [
    { id: 'card', name: 'Credit Card', icon: '💳', color: 'bg-blue-500' },
    { id: 'paypal', name: 'PayPal', icon: 'P', color: 'bg-blue-600' },
    { id: 'bank', name: 'Bank Transfer', icon: '🏦', color: 'bg-green-600' },
  ];

  const walletAddresses = {
    usdt: 'TJfUBJX8mFb9dUUdg2YHUN',
    bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    ethereum: '0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6',
    litecoin: 'LTC1qT7F7u8F7u8F7u8F7u8F7u8F7u8F7u8',
  };

  const handleProcessPayment = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (selectedPaymentType === 'crypto') {
        const cryptoData: CreateCryptoPaymentRequest = {
          amount: 100, // Default amount for testing
          currency: selectedCrypto.toUpperCase(),
          paymentMethod: selectedCrypto.toUpperCase(),
          gateway: 'MANUAL_CRYPTO',
          cryptoNetwork: cryptoMethods.find(c => c.id === selectedCrypto)?.network || 'Tron',
          description: `Deposit ${selectedCrypto.toUpperCase()} to account`,
        };

        const result = await paymentApi.createCryptoPayment(cryptoData);
        setCurrentPayment(result);
        setPaymentId(result.paymentId);
        setSuccess('Crypto payment address generated successfully!');
      } else {
        const fiatData: CreateFiatPaymentRequest = {
          amount: amount,
          currency: 'USD',
          paymentMethod: selectedFiat === 'card' ? 'CREDIT_CARD' : 'PAYPAL',
          gateway: selectedFiat === 'card' ? 'STRIPE' : 'PAYPAL',
          description: `Deposit ${selectedFiat} to account`,
        };

        const result = await paymentApi.createFiatPayment(fiatData);
        setCurrentPayment(result);
        setPaymentId(result.paymentId);
        
        if (result.clientSecret && selectedFiat === 'card') {
          // For Stripe, show the payment component
          setShowStripePayment(true);
          setSuccess('Payment ready! Complete your payment below.');
        } else if (result.redirectUrl && selectedFiat === 'paypal') {
          // For PayPal, show the payment component
          setShowPayPalPayment(true);
          setSuccess('Payment ready! Complete your payment below.');
        } else if (selectedFiat === 'bank') {
          // For Bank Transfer, show the transfer component
          setShowBankTransfer(true);
          setSuccess('Bank transfer details ready!');
        } else if (result.redirectUrl) {
          window.open(result.redirectUrl, '_blank');
          setSuccess('Redirecting to payment provider...');
        } else {
          setSuccess('Fiat payment created successfully!');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAddress = async () => {
    const address = currentPayment?.address || walletAddresses[selectedCrypto];
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy address:', err);
    }
  };

  const getCryptoIcon = (crypto: CryptoMethod) => {
    const method = cryptoMethods.find(m => m.id === crypto);
    return (
      <div className={`w-8 h-8 rounded-full ${method?.color} flex items-center justify-center text-white font-bold text-sm`}>
        {method?.icon}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] bg-gray-900 border-gray-700 text-white flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between flex-shrink-0">
          <DialogTitle className="text-xl font-bold">
            Add funds to your account
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Side - Crypto Deposit Section */}
            {selectedPaymentType === 'crypto' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Your <span className="text-green-500">{cryptoMethods.find(c => c.id === selectedCrypto)?.name}</span> deposit wallet
                  </h3>
                  
                  {/* QR Code */}
                  <div className="mb-4">
                    <QRCode address={currentPayment?.address || walletAddresses[selectedCrypto]} size={128} />
                  </div>

                  {/* Network Selection */}
                  <div className="mb-4">
                    <select 
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      value={cryptoMethods.find(c => c.id === selectedCrypto)?.network}
                      disabled
                    >
                      <option>{cryptoMethods.find(c => c.id === selectedCrypto)?.network}</option>
                    </select>
                  </div>

                  {/* Wallet Address */}
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      value={currentPayment?.address || walletAddresses[selectedCrypto]}
                      readOnly
                      className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyAddress}
                      className="text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                      {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>

                  {/* Deposit Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-gray-300">Send only {cryptoMethods.find(c => c.id === selectedCrypto)?.name} to this address</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dot className="w-4 h-4 text-yellow-500" />
                      <span className="text-gray-300">Minimum deposit: 0.001 {selectedCrypto.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dot className="w-4 h-4 text-blue-500" />
                      <span className="text-gray-300">Network: {cryptoMethods.find(c => c.id === selectedCrypto)?.network}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Left Side - Fiat Payment Section */}
            {selectedPaymentType === 'fiat' && (
              <div className="space-y-6">
                {!showStripePayment && !showPayPalPayment && !showBankTransfer ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Payment Details
                    </h3>
                    
                    {/* Amount Input */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
                      <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                      />
                    </div>

                    {/* Currency Selection */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Currency</label>
                      <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>

                    {/* Card Details */}
                    {selectedFiat === 'card' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Expiry</label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">CVV</label>
                            <input
                              type="text"
                              placeholder="123"
                              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : showStripePayment ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Complete Payment
                    </h3>
                    {currentPayment?.clientSecret && (
                      <StripePayment
                        clientSecret={currentPayment.clientSecret}
                        amount={amount}
                        currency="USD"
                        onSuccess={() => {
                          setShowStripePayment(false);
                          setSuccess('Payment completed successfully!');
                        }}
                        onError={(error) => {
                          setError(error);
                          setShowStripePayment(false);
                        }}
                      />
                    )}
                  </div>
                ) : showPayPalPayment ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Complete Payment
                    </h3>
                    {currentPayment?.redirectUrl && (
                      <PayPalPayment
                        redirectUrl={currentPayment.redirectUrl}
                        amount={amount}
                        currency="USD"
                        onSuccess={() => {
                          setShowPayPalPayment(false);
                          setSuccess('Payment completed successfully!');
                        }}
                        onError={(error) => {
                          setError(error);
                          setShowPayPalPayment(false);
                        }}
                      />
                    )}
                  </div>
                ) : showBankTransfer ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Bank Transfer Details
                    </h3>
                    <BankTransfer
                      amount={amount}
                      currency="USD"
                      onSuccess={() => {
                        setShowBankTransfer(false);
                        setSuccess('Bank transfer initiated! Funds will be credited within 1-3 business days.');
                      }}
                    />
                  </div>
                ) : null}
              </div>
            )}

            {/* Right Side - Payment Method Selection */}
            <div className="space-y-6">
              {/* Payment Type Toggle */}
              <div className="flex bg-gray-800 rounded-lg p-1">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPaymentType('crypto')}
                  className={`flex-1 ${
                    selectedPaymentType === 'crypto' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-transparent hover:bg-gray-700'
                  }`}
                >
                  CRYPTO
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedPaymentType('fiat')}
                  className={`flex-1 ${
                    selectedPaymentType === 'fiat' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-transparent hover:bg-gray-700'
                  }`}
                >
                  FIAT
                </Button>
              </div>

              {/* Crypto Methods */}
              {selectedPaymentType === 'crypto' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">CRYPTO</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {cryptoMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant="ghost"
                        onClick={() => setSelectedCrypto(method.id as CryptoMethod)}
                        className={`h-16 flex items-center gap-3 justify-start px-4 rounded-lg ${
                          selectedCrypto === method.id 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        {getCryptoIcon(method.id as CryptoMethod)}
                        <div className="text-left">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-xs text-gray-400">{method.network}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Fiat Methods */}
              {selectedPaymentType === 'fiat' && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">FIAT</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {fiatMethods.map((method) => (
                      <Button
                        key={method.id}
                        variant="ghost"
                        onClick={() => setSelectedFiat(method.id as FiatMethod)}
                        className={`h-16 flex items-center gap-3 justify-start px-4 rounded-lg ${
                          selectedFiat === method.id 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full ${method.color} flex items-center justify-center text-white font-bold text-sm`}>
                          {method.icon}
                        </div>
                        <div className="font-medium">{method.name}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm mt-4 flex-shrink-0">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-900/20 border border-green-500/50 rounded-lg text-green-300 text-sm mt-4 flex-shrink-0">
            {success}
          </div>
        )}

        {/* Real-time Payment Status */}
        {paymentId && (
          <div className="p-3 bg-blue-900/20 border border-blue-500/50 rounded-lg text-blue-300 text-sm mt-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isCompleted && <CheckCircle className="w-4 h-4 text-green-500" />}
              {isFailed && <X className="w-4 h-4 text-red-500" />}
              <span>
                {isPending && "Payment processing..."}
                {isCompleted && "Payment completed successfully!"}
                {isFailed && "Payment failed"}
                {statusError && `Error: ${statusError}`}
              </span>
            </div>
            {status && (
              <div className="mt-2 text-xs text-gray-400">
                Status: {status.status} | Gateway: {status.gatewayId}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {!showStripePayment && !showPayPalPayment && !showBankTransfer && (
          <div className="flex gap-3 pt-4 mt-4 flex-shrink-0">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-800 border-gray-600 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessPayment}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                selectedPaymentType === 'crypto' ? 'Generate Address' : 'Process Payment'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;