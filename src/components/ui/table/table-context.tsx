"use client";

import React, { createContext, useContext, useReducer, useCallback } from "react";
import { TableState, TableContextValue, TableColumn, TableAction } from "./types";

// Table state reducer
type TableActionType = 
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_CURRENT_PAGE"; payload: number }
  | { type: "SET_PAGE_SIZE"; payload: number }
  | { type: "SET_SORT"; payload: { key: string; direction: "asc" | "desc" } | null }
  | { type: "SET_FILTERS"; payload: Record<string, any> }
  | { type: "SET_SELECTED_ROW_KEYS"; payload: (string | number)[] }
  | { type: "UPDATE_STATE"; payload: Partial<TableState> }
  | { type: "RESET_STATE" };

const initialState: TableState = {
  searchTerm: "",
  currentPage: 1,
  pageSize: 10,
  sort: null,
  filters: {},
  selectedRowKeys: [],
};

function tableReducer(state: TableState, action: TableActionType): TableState {
  switch (action.type) {
    case "SET_SEARCH_TERM":
      return { ...state, searchTerm: action.payload, currentPage: 1 };
    case "SET_CURRENT_PAGE":
      return { ...state, currentPage: action.payload };
    case "SET_PAGE_SIZE":
      return { ...state, pageSize: action.payload, currentPage: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload };
    case "SET_FILTERS":
      return { ...state, filters: action.payload, currentPage: 1 };
    case "SET_SELECTED_ROW_KEYS":
      return { ...state, selectedRowKeys: action.payload };
    case "UPDATE_STATE":
      return { ...state, ...action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
}

// Create context
const TableContext = createContext<TableContextValue<any> | null>(null);

// Provider component
interface TableProviderProps<T = any> {
  children: React.ReactNode;
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  rowKey?: keyof T | ((row: T) => string | number);
  onSelectionChange?: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
}

export function TableProvider<T = any>({
  children,
  data,
  columns,
  actions,
  rowKey,
  onSelectionChange,
}: TableProviderProps<T>) {
  const [state, dispatch] = useReducer(tableReducer, initialState);

  // Get row key function
  const getRowKey = useCallback((row: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(row);
    }
    if (typeof rowKey === "string" && rowKey in (row as object)) {
      return (row as any)[rowKey];
    }
    return index;
  }, [rowKey]);

  // Update state function
  const updateState = useCallback((updates: Partial<TableState>) => {
    dispatch({ type: "UPDATE_STATE", payload: updates });
  }, []);

  // Check if row is selected
  const isSelected = useCallback((row: T, index: number): boolean => {
    const key = getRowKey(row, index);
    return state.selectedRowKeys.includes(key);
  }, [state.selectedRowKeys, getRowKey]);

  // Toggle row selection
  const toggleSelection = useCallback((row: T, index: number) => {
    const key = getRowKey(row, index);
    const isCurrentlySelected = state.selectedRowKeys.includes(key);
    
    let newSelectedKeys: (string | number)[];
    if (isCurrentlySelected) {
      newSelectedKeys = state.selectedRowKeys.filter(k => k !== key);
    } else {
      newSelectedKeys = [...state.selectedRowKeys, key];
    }
    
    dispatch({ type: "SET_SELECTED_ROW_KEYS", payload: newSelectedKeys });
    
    // Call selection change callback
    if (onSelectionChange) {
      const selectedRows = data.filter((row, index) => 
        newSelectedKeys.includes(getRowKey(row, index))
      );
      onSelectionChange(newSelectedKeys, selectedRows);
    }
  }, [state.selectedRowKeys, getRowKey, data, onSelectionChange]);

  // Select all rows
  const selectAll = useCallback(() => {
    const allKeys = data.map((row, index) => getRowKey(row, index));
    dispatch({ type: "SET_SELECTED_ROW_KEYS", payload: allKeys });
    
    if (onSelectionChange) {
      onSelectionChange(allKeys, data);
    }
  }, [data, getRowKey, onSelectionChange]);

  // Clear selection
  const clearSelection = useCallback(() => {
    dispatch({ type: "SET_SELECTED_ROW_KEYS", payload: [] });
    
    if (onSelectionChange) {
      onSelectionChange([], []);
    }
  }, [onSelectionChange]);

  const contextValue: TableContextValue<T> = {
    data,
    columns,
    actions,
    state,
    updateState,
    getRowKey,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
  };

  return (
    <TableContext.Provider value={contextValue}>
      {children}
    </TableContext.Provider>
  );
}

// Hook to use table context
export function useTable<T = any>(): TableContextValue<T> {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }
  return context;
}

// Hook to use table state
export function useTableState() {
  const { state, updateState } = useTable();
  return { state, updateState };
}

// Hook to use table selection
export function useTableSelection<T = any>() {
  const { 
    state, 
    isSelected, 
    toggleSelection, 
    selectAll, 
    clearSelection 
  } = useTable<T>();
  
  return {
    selectedRowKeys: state.selectedRowKeys,
    isSelected,
    toggleSelection,
    selectAll,
    clearSelection,
    hasSelection: state.selectedRowKeys.length > 0,
    selectedCount: state.selectedRowKeys.length,
  };
}
