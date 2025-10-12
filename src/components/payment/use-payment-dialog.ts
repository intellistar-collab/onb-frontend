"use client";

import { useState, useCallback } from "react";

export type PaymentMethod = 'crypto' | 'fiat';
export type CryptoMethod = 'bitcoin' | 'ethereum' | 'usdt' | 'litecoin';
export type FiatMethod = 'card' | 'paypal' | 'bank';

export interface PaymentState {
  selectedPaymentType: PaymentMethod;
  selectedCrypto: CryptoMethod;
  selectedFiat: FiatMethod;
  amount: number;
  currency: string;
}

export const usePaymentDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentState, setPaymentState] = useState<PaymentState>({
    selectedPaymentType: 'crypto',
    selectedCrypto: 'usdt',
    selectedFiat: 'card',
    amount: 0,
    currency: 'USD',
  });

  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
  }, []);

  const updatePaymentState = useCallback((updates: Partial<PaymentState>) => {
    setPaymentState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    isOpen,
    paymentState,
    openDialog,
    closeDialog,
    updatePaymentState,
  };
};
