import { getAuthHeaders } from './auth-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

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
  status: 'KEPT' | 'SOLD';
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryItemData {
  itemId: string;
  boxId: string;
  status: 'KEPT' | 'SOLD';
}

export interface UpdateInventoryItemData {
  status?: 'KEPT' | 'SOLD';
}

export const inventoryAPI = {
  // Get user's inventory items
  async getInventoryItems(): Promise<InventoryItem[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to fetch inventory items');
      }

      const data = await response.json();
      return data.items || [];
    } catch (error) {
      console.error('Error fetching inventory items:', error);
      throw error;
    }
  },

  // Add item to inventory (keep item)
  async addToInventory(itemData: CreateInventoryItemData): Promise<InventoryItem> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to add item to inventory');
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding item to inventory:', error);
      throw error;
    }
  },

  // Sell item from inventory
  async sellItem(itemId: string): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/inventory/${itemId}/sell`, {
        method: 'PUT',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to sell item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error selling item:', error);
      throw error;
    }
  },

  // Update inventory item
  async updateInventoryItem(itemId: string, updateData: UpdateInventoryItemData): Promise<InventoryItem> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/inventory/${itemId}`, {
        method: 'PUT',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to update inventory item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  },

  // Delete inventory item
  async deleteInventoryItem(itemId: string): Promise<{ success: boolean; message: string }> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/api/inventory/${itemId}`, {
        method: 'DELETE',
        headers,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized');
        }
        throw new Error('Failed to delete inventory item');
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  },
};
