const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface Box {
  id: string;
  title: string;
  description?: string;
  location: string;
  price: number;
  imageUrl: string;
  backgroundImage?: string;
  isActive: boolean;
  order: number;
  boxCategoryId: string;
  purchasedCount: number;
  totalRevenue: number;
  totalPayout: number;
  exchangeablePayout: number;
  retainedProfitPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  boxCategory?: {
    id: string;
    name: string;
    color?: string;
  };
}

export interface CreateBoxData {
  title: string;
  description?: string;
  location: string;
  price: string; // Backend expects string
  imageUrl?: string;
  backgroundImage?: string;
  isActive?: boolean;
  order?: number;
  boxCategoryId: string;
  // Removed purchasedCount, totalRevenue, totalPayout, exchangeablePayout, retainedProfitPercentage
}

export interface UpdateBoxData {
  title?: string;
  description?: string;
  location?: string;
  price?: string; // Backend expects string
  imageUrl?: string;
  backgroundImage?: string;
  isActive?: boolean;
  order?: number;
  boxCategoryId?: string;
  // Removed purchasedCount, totalRevenue, totalPayout, exchangeablePayout, retainedProfitPercentage
}

export interface BoxStats {
  totalBoxes: number;
  activeBoxes: number;
  totalRevenue: number;
  totalSales: number;
}

class BoxesAPI {
  private async getAuthHeaders(): Promise<HeadersInit> {
    // Get the session token from cookies
    const allCookies = document.cookie;
    
    const token = allCookies
      .split('; ')
      .find(row => row.startsWith('better-auth.session_token='))
      ?.split('=')[1];

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async getAllBoxes(): Promise<Box[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/boxes`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch boxes: ${response.statusText}`;
        
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
      console.error('Error fetching boxes:', error);
      throw error;
    }
  }

  async getBoxById(id: string): Promise<Box> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/boxes/${id}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch box: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching box:', error);
      throw error;
    }
  }

  async createBox(data: CreateBoxData): Promise<Box> {
    try {
      const response = await fetch(`${API_BASE_URL}/boxes`, {
        method: 'POST',
        headers: await this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create box: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating box:', error);
      throw error;
    }
  }

  async updateBox(id: string, data: UpdateBoxData): Promise<Box> {
    try {
      const response = await fetch(`${API_BASE_URL}/boxes/${id}`, {
        method: 'PUT',
        headers: await this.getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to update box: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating box:', error);
      throw error;
    }
  }

  async deleteBox(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/boxes/${id}`, {
        method: 'DELETE',
        headers: await this.getAuthHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to delete box: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting box:', error);
      throw error;
    }
  }

  async getBoxStats(): Promise<BoxStats> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/boxes/stats`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to fetch box stats: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching box stats:', error);
      throw error;
    }
  }

  async uploadImage(file: File): Promise<{ uploadUrl: string }> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      // Get auth headers but remove Content-Type to let browser set it for FormData
      const authHeaders = await this.getAuthHeaders() as Record<string, string>;
      delete authHeaders['Content-Type'];

      const response = await fetch(`${API_BASE_URL}/boxes/upload`, {
        method: 'POST',
        headers: authHeaders,
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || `Failed to upload image: ${response.statusText}`;
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please log in as an admin user.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Admin privileges required.');
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }

  async toggleBoxStatus(id: string, isActive: boolean): Promise<Box> {
    return this.updateBox(id, { isActive });
  }
}

export const boxesAPI = new BoxesAPI();
