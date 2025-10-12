"use client";

import { useState, useEffect, useCallback } from 'react';
import { paymentApi, PaymentStatus } from '@/lib/payment-api';

interface UsePaymentStatusProps {
  paymentId: string | null;
  enabled?: boolean;
  interval?: number;
}

export const usePaymentStatus = ({
  paymentId,
  enabled = true,
  interval = 3000, // 3 seconds
}: UsePaymentStatusProps) => {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!paymentId || !enabled) return;

    try {
      setLoading(true);
      setError(null);
      const paymentStatus = await paymentApi.getPaymentStatus(paymentId);
      setStatus(paymentStatus);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [paymentId, enabled]);

  useEffect(() => {
    if (!paymentId || !enabled) return;

    // Fetch immediately
    fetchStatus();

    // Set up polling
    const intervalId = setInterval(fetchStatus, interval);

    return () => clearInterval(intervalId);
  }, [paymentId, enabled, interval, fetchStatus]);

  const isCompleted = status?.status === 'COMPLETED';
  const isFailed = status?.status === 'FAILED';
  const isPending = status?.status === 'PENDING' || status?.status === 'PROCESSING';
  const isCancelled = status?.status === 'CANCELLED';

  return {
    status,
    loading,
    error,
    isCompleted,
    isFailed,
    isPending,
    isCancelled,
    refetch: fetchStatus,
  };
};
