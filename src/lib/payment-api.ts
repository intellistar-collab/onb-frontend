"use client";

import { authClient } from "@/lib/auth-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

export interface CreatePaymentRequest {
  amount: number;
  currency: string;
  paymentMethod: string;
  gateway: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface CreateCryptoPaymentRequest extends CreatePaymentRequest {
  cryptoNetwork: string;
  requiredConfirmations?: number;
}

export interface CreateFiatPaymentRequest extends CreatePaymentRequest {
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cardToken?: string;
}

export interface PaymentResponse {
  success: boolean;
  paymentId: string;
  gatewayId?: string;
  gatewayData?: Record<string, any>;
  redirectUrl?: string;
  qrCode?: string;
  address?: string;
  expiresAt?: string;
  clientSecret?: string; // For Stripe
  error?: string;
}

export interface PaymentStatus {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'EXPIRED';
  gatewayId?: string;
  gatewayData?: Record<string, any>;
  confirmations?: number;
  requiredConfirmations?: number;
  error?: string;
}

export interface PaymentHistoryItem {
  id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  gateway: string;
  createdAt: string;
  completedAt?: string;
  description?: string;
}

class PaymentApiService {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const session = await authClient.getSession();
    const token = session.data?.session?.token;
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  async createPayment(data: CreatePaymentRequest): Promise<PaymentResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/create`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create payment');
    }

    return await response.json();
  }

  async createCryptoPayment(data: CreateCryptoPaymentRequest): Promise<PaymentResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/create/crypto`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create crypto payment');
    }

    return await response.json();
  }

  async createFiatPayment(data: CreateFiatPaymentRequest): Promise<PaymentResponse> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/create/fiat`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create fiat payment');
    }

    const result = await response.json();
    
    // For Stripe, we need to handle the clientSecret differently
    if (result.gatewayData?.clientSecret) {
      // Return the clientSecret for frontend Stripe integration
      return {
        ...result,
        clientSecret: result.gatewayData.clientSecret,
        redirectUrl: undefined, // Don't redirect for Stripe
      };
    }
    
    return result;
  }

  async verifyPayment(paymentId: string, transactionHash?: string): Promise<PaymentStatus> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/verify`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ transactionHash }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify payment');
    }

    return await response.json();
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentStatus> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/status`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment status');
    }

    return await response.json();
  }

  async getPaymentHistory(limit: number = 10, offset: number = 0): Promise<PaymentHistoryItem[]> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/history?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment history');
    }

    return await response.json();
  }

  async getSupportedPaymentMethods(): Promise<{
    fiat: Array<{ method: string; gateway: string; name: string }>;
    crypto: Array<{ method: string; gateway: string; name: string; network: string }>;
  }> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/methods`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get payment methods');
    }

    return await response.json();
  }

  async refundPayment(paymentId: string, amount: number, reason?: string): Promise<{
    success: boolean;
    refundId: string;
    gatewayRefundId?: string;
    amount: number;
    status: string;
    error?: string;
  }> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}/payments/${paymentId}/refund`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to refund payment');
    }

    return await response.json();
  }
}

export const paymentApi = new PaymentApiService();
