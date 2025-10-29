import { getAuthHeaders, authenticatedFetch, handleApiError } from './auth-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  status: string;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  address: string | null;
  mobile: string | null;
  location: string | null;
  dob: Date | null;
  gender: string | null;
  streetNumberOrName: string | null;
  street: string | null;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  country: string | null;
  createdAt: Date;
  updatedAt: Date;
  wallet?: {
    id: string;
    userId: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  };
  // Referral and tracking properties
  referralSource?: string | null;
  affiliateCode?: string | null;
  campaign?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  // Analytics properties
  totalWinnings?: number;
  tokensSpent?: number;
  referralCount?: number;
  // Activity tracking
  lastLogin?: Date | null;
  loginHistory?: Array<{
    id: string;
    ipAddress: string;
    userAgent: string;
    createdAt: Date;
  }>;
  activityLogs?: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: Date;
  }>;
  transactions?: Array<{
    id: string;
    type: 'CREDIT' | 'DEBIT';
    amount: number;
    reason: string;
    createdAt: Date;
  }>;
}

export interface CreateUserData {
  email: string;
  username: string;
  role?: string; // Made optional since backend will set it to USER automatically
  status?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  address?: string;
  mobile?: string;
  location?: string;
  dob?: Date;
  gender?: string;
  streetNumberOrName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  role?: string;
  status?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  address?: string;
  mobile?: string;
  location?: string;
  dob?: Date;
  gender?: string;
  streetNumberOrName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface UserDetails extends User {
  wallet: {
    id: string;
    userId: string;
    balance: number;
    createdAt: Date;
    updatedAt: Date;
  };
  score: {
    id: number;
    userId: string;
    score: number;
    source: string;
    createdAt: Date;
  };
  analytics: {
    totalBoxesOpened: number;
    totalSpent: number;
    totalWinnings: number;
    averageBoxValue: number;
    lastActivity: Date;
    favoriteBoxCategory: string;
  };
  recentActivity: Array<{
    id: string;
    action: string;
    details: string;
    createdAt: Date;
  }>;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  amount: number;
  type: 'CREDIT' | 'DEBIT';
  reason: string;
  createdAt: Date;
}

export interface InventoryItem {
  id: string;
  userId: string;
  itemId: string;
  itemName: string;
  itemImage?: string;
  itemPrice: number;
  itemTier?: string;
  itemOdds: string;
  boxId: string;
  boxTitle: string;
  boxPrice: number;
  status: 'KEPT' | 'SOLD';
  createdAt: string;
  updatedAt: string;
}

class UsersAPI {
  // Using centralized getAuthHeaders from auth-utils

  async getAllUsers(): Promise<User[]> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch users: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const headers = await getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch user: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('User not found.');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers,
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to update user: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to delete user: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getUserDetails(id: string): Promise<UserDetails> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${id}/details`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch user details: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('User not found.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user details:', error);
      throw error;
    }
  }

  async getUserInventory(id: string): Promise<InventoryItem[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${id}/inventory`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch user inventory: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('User not found.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user inventory:', error);
      throw error;
    }
  }

  async getUserTransactions(id: string, page = 1, limit = 10): Promise<{ transactions: WalletTransaction[]; total: number; page: number; limit: number }> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/users/${id}/transactions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch user transactions: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        } else if (response.status === 404) {
          throw new Error('User not found.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      throw error;
    }
  }
}

export const usersAPI = new UsersAPI();
