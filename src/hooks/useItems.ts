"use client";

import { useState, useEffect, useCallback } from "react";
import { itemsAPI, type Item, type CreateItemData, type UpdateItemData } from "@/lib/api/items";

interface UseItemsOptions {
  autoFetch?: boolean;
  sortBy?: 'createdAt' | 'name' | 'price' | 'percentage' | 'viewCount' | 'clickCount';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    status?: 'MOST_WANTED' | 'WANTED' | 'IN_DEMAND' | 'UNCOMMON' | 'COMMON';
    boxId?: string;
    priceRange?: {
      min?: number;
      max?: number;
    };
  };
}

interface UseItemsReturn {
  items: Item[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createItem: (data: CreateItemData) => Promise<Item>;
  updateItem: (id: string, data: UpdateItemData) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
  getItemById: (id: string) => Item | undefined;
  getItemsByStatus: (status: string) => Item[];
  getItemsByBox: (boxId: string) => Item[];
  getItemsByPriceRange: (min: number, max: number) => Item[];
  getMostWantedItems: () => Item[];
  getPopularItems: (limit?: number) => Item[];
  getRecentItems: (limit?: number) => Item[];
}

export const useItems = (options: UseItemsOptions = {}): UseItemsReturn => {
  const {
    autoFetch = true,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filterBy = {}
  } = options;

  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await itemsAPI.getAllItems();
      setItems(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch items';
      setError(errorMessage);
      console.error('Error fetching items:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = useCallback(async (data: CreateItemData): Promise<Item> => {
    try {
      setError(null);
      const newItem = await itemsAPI.createItem(data);
      setItems(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (id: string, data: UpdateItemData): Promise<Item> => {
    try {
      setError(null);
      const updatedItem = await itemsAPI.updateItem(id, data);
      setItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await itemsAPI.deleteItem(id);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getItemById = useCallback((id: string): Item | undefined => {
    return items.find(item => item.id === id);
  }, [items]);

  const getItemsByStatus = useCallback((status: string): Item[] => {
    return items.filter(item => item.status === status);
  }, [items]);

  const getItemsByBox = useCallback((boxId: string): Item[] => {
    return items.filter(item => item.boxId === boxId);
  }, [items]);

  const getItemsByPriceRange = useCallback((min: number, max: number): Item[] => {
    return items.filter(item => {
      if (!item.price) return false;
      return item.price >= min && item.price <= max;
    });
  }, [items]);

  const getMostWantedItems = useCallback((): Item[] => {
    return items.filter(item => item.status === 'MOST_WANTED');
  }, [items]);

  const getPopularItems = useCallback((limit: number = 10): Item[] => {
    return items
      .sort((a, b) => (b.viewCount + b.clickCount) - (a.viewCount + a.clickCount))
      .slice(0, limit);
  }, [items]);

  const getRecentItems = useCallback((limit: number = 5): Item[] => {
    return items
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [items]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchItems();
    }
  }, [autoFetch, fetchItems]);

  // Apply sorting and filtering
  const processedItems = items
    .filter(item => {
      if (filterBy.status && item.status !== filterBy.status) return false;
      if (filterBy.boxId && item.boxId !== filterBy.boxId) return false;
      if (filterBy.priceRange && item.price) {
        if (filterBy.priceRange.min && item.price < filterBy.priceRange.min) return false;
        if (filterBy.priceRange.max && item.price > filterBy.priceRange.max) return false;
      }
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'percentage':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case 'viewCount':
          aValue = a.viewCount;
          bValue = b.viewCount;
          break;
        case 'clickCount':
          aValue = a.clickCount;
          bValue = b.clickCount;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return {
    items: processedItems,
    isLoading,
    error,
    refetch: fetchItems,
    createItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByStatus,
    getItemsByBox,
    getItemsByPriceRange,
    getMostWantedItems,
    getPopularItems,
    getRecentItems,
  };
};
