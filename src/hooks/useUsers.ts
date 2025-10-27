"use client";

import { useState, useEffect, useCallback } from "react";
import { usersAPI, type User, type CreateUserData, type UpdateUserData } from "@/lib/api/users";

interface UseUsersOptions {
  autoFetch?: boolean;
  sortBy?: 'createdAt' | 'username' | 'email';
  sortOrder?: 'asc' | 'desc';
  filterBy?: {
    status?: string;
    role?: string;
  };
}

interface UseUsersReturn {
  users: User[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createUser: (data: CreateUserData) => Promise<User>;
  updateUser: (id: string, data: UpdateUserData) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  getUserById: (id: string) => User | undefined;
  getUsersByStatus: (status: string) => User[];
  getUsersByRole: (role: string) => User[];
  getTodayUsers: () => User[];
  getPendingUsers: () => User[];
}

export const useUsers = (options: UseUsersOptions = {}): UseUsersReturn => {
  const {
    autoFetch = true,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    filterBy = {}
  } = options;

  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await usersAPI.getAllUsers();
      setUsers(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createUser = useCallback(async (data: CreateUserData): Promise<User> => {
    try {
      setError(null);
      const newUser = await usersAPI.createUser(data);
      setUsers(prev => [newUser, ...prev]);
      return newUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create user';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateUser = useCallback(async (id: string, data: UpdateUserData): Promise<User> => {
    try {
      setError(null);
      const updatedUser = await usersAPI.updateUser(id, data);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await usersAPI.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete user';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getUserById = useCallback((id: string): User | undefined => {
    return users.find(user => user.id === id);
  }, [users]);

  const getUsersByStatus = useCallback((status: string): User[] => {
    return users.filter(user => user.status === status);
  }, [users]);

  const getUsersByRole = useCallback((role: string): User[] => {
    return users.filter(user => user.role === role);
  }, [users]);

  const getTodayUsers = useCallback((): User[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return users.filter(user => {
      const userDate = new Date(user.createdAt);
      userDate.setHours(0, 0, 0, 0);
      return userDate.getTime() === today.getTime();
    });
  }, [users]);

  const getPendingUsers = useCallback((): User[] => {
    return users.filter(user => user.status === 'PENDING');
  }, [users]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  // Apply sorting and filtering
  const processedUsers = users
    .filter(user => {
      if (filterBy.status && user.status !== filterBy.status) return false;
      if (filterBy.role && user.role !== filterBy.role) return false;
      return true;
    })
    .sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'username':
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
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
    users: processedUsers,
    isLoading,
    error,
    refetch: fetchUsers,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    getUsersByStatus,
    getUsersByRole,
    getTodayUsers,
    getPendingUsers,
  };
};
