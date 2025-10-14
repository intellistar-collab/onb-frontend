const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface UserProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  dob?: Date;
  gender?: string;
  username: string;
  email: string;
  avatar?: string;
  address?: string;
  streetNumberOrName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  mobile?: string;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  dob?: string;
  gender?: string;
  username?: string;
  email?: string;
  avatar?: string;
  address?: string;
  streetNumberOrName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  mobile?: string;
  location?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface WalletData {
  id: string;
  userId: string;
  balance: number;
  pendingDeposits: number;
  totalDeposited: number;
  totalWithdrawn: number;
  currency: string;
  autoWithdraw: boolean;
  lowBalanceAlert: boolean;
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  type: 'deposit' | 'withdrawal' | 'purchase' | 'win';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  method: string;
  description: string;
  createdAt: Date;
}

export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'light' | 'dark' | 'auto';
  language: string;
  currency: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  privacy: {
    showProfile: boolean;
    showStats: boolean;
    showActivity: boolean;
  };
  updatedAt: Date;
}

export interface UpdatePreferencesData {
  theme?: 'light' | 'dark' | 'auto';
  language?: string;
  currency?: string;
  notifications?: {
    email?: boolean;
    push?: boolean;
    marketing?: boolean;
  };
  privacy?: {
    showProfile?: boolean;
    showStats?: boolean;
    showActivity?: boolean;
  };
}

// Helper function to get auth headers (use better-auth client session)
import { authClient } from "@/lib/auth-client";

const getAuthHeaders = async (): Promise<HeadersInit> => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const session = await authClient.getSession();
    const token = session.data?.session?.token;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (_err) {
    // Fallback to cookie parsing if session fetch fails (best-effort)
    try {
      if (typeof window !== 'undefined') {
        const lsToken = localStorage.getItem('better-auth.session_token');
        if (lsToken) {
          headers['Authorization'] = `Bearer ${lsToken}`;
          return headers;
        }
      }
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const sessionCookie = cookies.find(cookie => cookie.trim().startsWith('better-auth.session_token='));
        if (sessionCookie) {
          const token = sessionCookie.split('=')[1];
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch (_e) {}
  }

  return headers;
};

// Profile API
export const profileAPI = {
  async getProfile(): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/account/profile`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch profile');
    }

    return response.json();
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    const response = await fetch(`${API_BASE_URL}/api/account/profile`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update profile');
    }

    return response.json();
  },
};

// Security API
export const securityAPI = {
  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/account/change-password`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to change password');
    }

    return response.json();
  },

  async enable2FA(): Promise<{ qrCode: string; secret: string }> {
    const response = await fetch(`${API_BASE_URL}/api/account/security/enable-2fa`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to enable 2FA');
    }

    return response.json();
  },

  async verify2FA(token: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/api/account/security/verify-2fa`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to verify 2FA');
    }

    return response.json();
  },
};

// Wallet API
export const walletAPI = {
  async getWallet(): Promise<WalletData> {
    const response = await fetch(`${API_BASE_URL}/api/account/wallet`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch wallet');
    }

    return response.json();
  },

  async updateWalletSettings(data: Partial<WalletData>): Promise<WalletData> {
    const response = await fetch(`${API_BASE_URL}/api/account/wallet`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update wallet settings');
    }

    return response.json();
  },

  async getTransactions(page = 1, limit = 10): Promise<{ transactions: WalletTransaction[]; total: number; page: number; limit: number }> {
    const response = await fetch(`${API_BASE_URL}/api/account/wallet/transactions?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch transactions');
    }

    return response.json();
  },

  async addFunds(amount: number, paymentMethod: string): Promise<{ message: string; transactionId: string }> {
    const response = await fetch(`${API_BASE_URL}/api/account/wallet/add-funds`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ amount, paymentMethod }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add funds');
    }

    return response.json();
  },

  async withdraw(amount: number, paymentMethod: string): Promise<{ message: string; transactionId: string }> {
    const response = await fetch(`${API_BASE_URL}/api/account/wallet/withdraw`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ amount, paymentMethod }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to withdraw funds');
    }

    return response.json();
  },
};

// Preferences API
export const preferencesAPI = {
  async getPreferences(): Promise<UserPreferences> {
    const response = await fetch(`${API_BASE_URL}/api/account/preferences`, {
      method: 'GET',
      headers: await getAuthHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch preferences');
    }

    return response.json();
  },

  async updatePreferences(data: UpdatePreferencesData): Promise<UserPreferences> {
    const response = await fetch(`${API_BASE_URL}/api/account/preferences`, {
      method: 'PUT',
      headers: await getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized');
      }
      if (response.status === 403) {
        throw new Error('Forbidden');
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update preferences');
    }

    return response.json();
  },
};
