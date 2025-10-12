const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface BoxCategory {
  id: string;
  name: string;
  description: string | null;
  photo: string | null;
  order: number;
  color: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBoxCategoryData {
  name: string;
  description?: string;
  photo?: string;
  order?: number;
  color?: string;
}

export interface UpdateBoxCategoryData {
  name?: string;
  description?: string;
  photo?: string;
  order?: number;
  color?: string;
}

class BoxCategoriesAPI {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = localStorage.getItem('better-auth.session_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getAllBoxCategories(): Promise<BoxCategory[]> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/box-categories`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch box categories');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching box categories:', error);
      throw error;
    }
  }

  async getBoxCategoryById(id: string): Promise<BoxCategory> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/box-categories/${id}`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch box category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching box category:', error);
      throw error;
    }
  }

  async createBoxCategory(data: CreateBoxCategoryData): Promise<BoxCategory> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/box-categories`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create box category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating box category:', error);
      throw error;
    }
  }

  async updateBoxCategory(id: string, data: UpdateBoxCategoryData): Promise<BoxCategory> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/box-categories/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update box category');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating box category:', error);
      throw error;
    }
  }

  async deleteBoxCategory(id: string): Promise<void> {
    try {
      const headers = await this.getAuthHeaders();
      
      const response = await fetch(`${API_BASE_URL}/box-categories/${id}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete box category');
      }
    } catch (error) {
      console.error('Error deleting box category:', error);
      throw error;
    }
  }

  async uploadPhoto(file: File): Promise<{ uploadUrl: string }> {
    try {
      const headers = await this.getAuthHeaders();
      
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/box-categories/upload`, {
        method: 'POST',
        headers: {
          ...headers,
          // Remove Content-Type to let browser set it with boundary for FormData
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload photo');
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }
  }
}

export const boxCategoriesAPI = new BoxCategoriesAPI();
