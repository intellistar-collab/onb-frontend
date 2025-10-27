"use client";

import { useState, useEffect, useCallback } from "react";
import { boxCategoriesAPI, type BoxCategory, type CreateBoxCategoryData, type UpdateBoxCategoryData } from "@/lib/api/box-categories";

interface UseBoxCategoriesOptions {
  autoFetch?: boolean;
  sortBy?: 'createdAt' | 'name' | 'order';
  sortOrder?: 'asc' | 'desc';
}

interface UseBoxCategoriesReturn {
  categories: BoxCategory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createCategory: (data: CreateBoxCategoryData) => Promise<BoxCategory>;
  updateCategory: (id: string, data: UpdateBoxCategoryData) => Promise<BoxCategory>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoryById: (id: string) => BoxCategory | undefined;
  getCategoriesByColor: (color: string) => BoxCategory[];
  getSortedCategories: () => BoxCategory[];
}

export const useBoxCategories = (options: UseBoxCategoriesOptions = {}): UseBoxCategoriesReturn => {
  const {
    autoFetch = true,
    sortBy = 'order',
    sortOrder = 'asc'
  } = options;

  const [categories, setCategories] = useState<BoxCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await boxCategoriesAPI.getAllBoxCategories();
      setCategories(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch box categories';
      setError(errorMessage);
      console.error('Error fetching box categories:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (data: CreateBoxCategoryData): Promise<BoxCategory> => {
    try {
      setError(null);
      const newCategory = await boxCategoriesAPI.createBoxCategory(data);
      setCategories(prev => [newCategory, ...prev]);
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create box category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateCategory = useCallback(async (id: string, data: UpdateBoxCategoryData): Promise<BoxCategory> => {
    try {
      setError(null);
      const updatedCategory = await boxCategoriesAPI.updateBoxCategory(id, data);
      setCategories(prev => prev.map(category => category.id === id ? updatedCategory : category));
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update box category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await boxCategoriesAPI.deleteBoxCategory(id);
      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete box category';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getCategoryById = useCallback((id: string): BoxCategory | undefined => {
    return categories.find(category => category.id === id);
  }, [categories]);

  const getCategoriesByColor = useCallback((color: string): BoxCategory[] => {
    return categories.filter(category => category.color === color);
  }, [categories]);

  const getSortedCategories = useCallback((): BoxCategory[] => {
    return [...categories].sort((a, b) => a.order - b.order);
  }, [categories]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCategories();
    }
  }, [autoFetch, fetchCategories]);

  // Apply sorting
  const processedCategories = categories
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
        case 'order':
          aValue = a.order;
          bValue = b.order;
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
    categories: processedCategories,
    isLoading,
    error,
    refetch: fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryById,
    getCategoriesByColor,
    getSortedCategories,
  };
};
