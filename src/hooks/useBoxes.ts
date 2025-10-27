"use client";

import { useState, useEffect, useCallback } from "react";
import { boxesAPI, type Box, type CreateBoxData, type UpdateBoxData } from "@/lib/api/boxes";

interface UseBoxesOptions {
  autoFetch?: boolean;
  sortBy?: 'createdAt' | 'title' | 'price' | 'purchasedCount';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    status?: 'ACTIVE' | 'DRAFT' | 'DISABLED';
    categoryId?: string;
    priceRange?: {
      min?: number;
      max?: number;
    };
  };
}

interface UseBoxesReturn {
  boxes: Box[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createBox: (data: CreateBoxData) => Promise<Box>;
  updateBox: (id: string, data: UpdateBoxData) => Promise<Box>;
  deleteBox: (id: string) => Promise<void>;
  getBoxById: (id: string) => Box | undefined;
  getBoxesByCategory: (categoryId: string) => Box[];
  getActiveBoxes: () => Box[];
  getBoxesByPriceRange: (min: number, max: number) => Box[];
  getRecentBoxes: (limit?: number) => Box[];
}

export const useBoxes = (options: UseBoxesOptions = {}): UseBoxesReturn => {
  const {
    autoFetch = true,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filterBy = {}
  } = options;

  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBoxes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await boxesAPI.getAllBoxes();
      setBoxes(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch boxes';
      setError(errorMessage);
      console.error('Error fetching boxes:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createBox = useCallback(async (data: CreateBoxData): Promise<Box> => {
    try {
      setError(null);
      const newBox = await boxesAPI.createBox(data);
      setBoxes(prev => [newBox, ...prev]);
      return newBox;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create box';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateBox = useCallback(async (id: string, data: UpdateBoxData): Promise<Box> => {
    try {
      setError(null);
      const updatedBox = await boxesAPI.updateBox(id, data);
      setBoxes(prev => prev.map(box => box.id === id ? updatedBox : box));
      return updatedBox;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update box';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteBox = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await boxesAPI.deleteBox(id);
      setBoxes(prev => prev.filter(box => box.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete box';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getBoxById = useCallback((id: string): Box | undefined => {
    return boxes.find(box => box.id === id);
  }, [boxes]);

  const getBoxesByCategory = useCallback((categoryId: string): Box[] => {
    return boxes.filter(box => box.boxCategoryId === categoryId);
  }, [boxes]);

  const getActiveBoxes = useCallback((): Box[] => {
    return boxes.filter(box => box.isActive);
  }, [boxes]);

  const getBoxesByPriceRange = useCallback((min: number, max: number): Box[] => {
    return boxes.filter(box => {
      const price = typeof box.price === 'string' ? parseFloat(box.price) : box.price;
      return price >= min && price <= max;
    });
  }, [boxes]);

  const getRecentBoxes = useCallback((limit: number = 5): Box[] => {
    return boxes
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }, [boxes]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchBoxes();
    }
  }, [autoFetch, fetchBoxes]);

  // Apply sorting and filtering
  const processedBoxes = boxes
    .filter(box => {
      if (filterBy.status && box.isActive !== (filterBy.status === 'ACTIVE')) return false;
      if (filterBy.categoryId && box.boxCategoryId !== filterBy.categoryId) return false;
      if (filterBy.priceRange) {
        const price = typeof box.price === 'string' ? parseFloat(box.price) : box.price;
        if (filterBy.priceRange.min && price < filterBy.priceRange.min) return false;
        if (filterBy.priceRange.max && price > filterBy.priceRange.max) return false;
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
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'price':
          aValue = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
          bValue = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
          break;
        case 'purchasedCount':
          aValue = a.purchasedCount;
          bValue = b.purchasedCount;
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
    boxes: processedBoxes,
    isLoading,
    error,
    refetch: fetchBoxes,
    createBox,
    updateBox,
    deleteBox,
    getBoxById,
    getBoxesByCategory,
    getActiveBoxes,
    getBoxesByPriceRange,
    getRecentBoxes,
  };
};
