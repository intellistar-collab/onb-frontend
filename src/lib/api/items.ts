const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface Item {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  percentage: number;
  status: 'MOST_WANTED' | 'WANTED' | 'IN_DEMAND' | 'UNCOMMON' | 'COMMON';
  viewCount: number;
  clickCount: number;
  boxId: string | null;
  createdAt: Date;
  updatedAt: Date;
  box?: {
    id: string;
    title: string;
  };
}

export interface CreateItemData {
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  percentage: number;
  status: 'MOST_WANTED' | 'WANTED' | 'IN_DEMAND' | 'UNCOMMON' | 'COMMON';
  boxId?: string | null;
}

export interface UpdateItemData {
  name?: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  percentage?: number;
  status?: 'MOST_WANTED' | 'WANTED' | 'IN_DEMAND' | 'UNCOMMON' | 'COMMON';
  boxId?: string | null;
}

export interface ItemStats {
  totalItems: number;
  mostWantedItems: number;
  totalViews: number;
  totalClicks: number;
}

class ItemsAPI {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const allCookies = document.cookie;
    const token = allCookies
      .split('; ')
      .find(row => row.startsWith('better-auth.session_token='))
      ?.split('=')[1];

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
      
      if (response.status === 401) {
        throw new Error('Authentication required. Please log in as an admin user.');
      } else if (response.status === 403) {
        throw new Error('Access denied. Admin privileges required.');
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  }

  async getAllItems(): Promise<Item[]> {
    const response = await this.request<{ data: Item[]; meta: any }>('/items?limit=1000', { headers: await this.getAuthHeaders(), credentials: 'include' });
    return response.data;
  }

  async getItemById(id: string): Promise<Item> {
    return this.request<Item>(`/items/${id}`, { headers: await this.getAuthHeaders(), credentials: 'include' });
  }

  async getItemsByBoxId(boxId: string): Promise<Item[]> {
    const response = await this.request<{ data: Item[]; meta: any }>(`/items?boxId=${boxId}&limit=1000`, { headers: await this.getAuthHeaders(), credentials: 'include' });
    return response.data;
  }

  async createItem(data: CreateItemData): Promise<Item> {
    return this.request<Item>('/items', {
      method: 'POST',
      headers: await this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
  }

  async updateItem(id: string, data: UpdateItemData): Promise<Item> {
    return this.request<Item>(`/items/${id}`, {
      method: 'PUT',
      headers: await this.getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify(data),
    });
  }

  async deleteItem(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/items/${id}`, {
      method: 'DELETE',
      headers: await this.getAuthHeaders(),
      credentials: 'include',
    });
  }

  async getItemStats(): Promise<ItemStats> {
    return this.request<ItemStats>('/items/stats', { headers: await this.getAuthHeaders(), credentials: 'include' });
  }

  async uploadImage(file: File): Promise<{ uploadUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const authHeaders = await this.getAuthHeaders() as Record<string, string>;
    delete authHeaders['Content-Type']; // Allow browser to set Content-Type for FormData

    const response = await fetch(`${API_BASE_URL}/items/upload`, {
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
    return response.json();
  }
}

export const itemsAPI = new ItemsAPI();