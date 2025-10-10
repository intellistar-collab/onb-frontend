const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface User {
  id: string;
  email: string;
  username: string;
  role: string;
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
}

export interface CreateUserData {
  email: string;
  username: string;
  role: string;
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

class UsersAPI {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get the session token from cookies
    const allCookies = document.cookie;
    console.log('Frontend API: All cookies:', allCookies);
    
    const token = allCookies
      .split('; ')
      .find(row => row.startsWith('better-auth.session_token='))
      ?.split('=')[1];

    console.log('Frontend API: Token found:', !!token);
    console.log('Frontend API: Token (first 20 chars):', token?.substring(0, 20));

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('Frontend API: Authorization header set');
    } else {
      console.log('Frontend API: No token found, no Authorization header');
    }

    return headers;
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const headers = await this.getAuthHeaders();
      console.log('Frontend API: Making request to getAllUsers');
      console.log('Frontend API: Headers:', headers);
      console.log('Frontend API: API Base URL:', API_BASE_URL);
      
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      console.log('Frontend API: Response status:', response.status);
      console.log('Frontend API: Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Frontend API: Error data:', errorData);
        const errorMessage = errorData.message || `Failed to fetch users: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Frontend API: Success - received users:', data.length);
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async createUser(userData: CreateUserData): Promise<User> {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
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
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to update user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
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
}

export const usersAPI = new UsersAPI();
