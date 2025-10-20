import { getAuthHeaders } from './auth-utils';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:8000';

export interface OpenBoxResponse {
  inventoryItem: {
    id: string;
    userId: string;
    itemId: string;
    itemName: string;
    itemImage: string;
    itemPrice: number;
    itemTier: string;
    itemOdds: string;
    boxId: string;
    boxTitle: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  boxPrice: number;
  selectedItem: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

export const boxOpeningAPI = {
  async openBox(boxId: string): Promise<OpenBoxResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/boxes/open`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boxId }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Unauthorized');
        }
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to open box');
      }

      return await response.json();
    } catch (error) {
      console.error('Error opening box:', error);
      throw error;
    }
  },
};
