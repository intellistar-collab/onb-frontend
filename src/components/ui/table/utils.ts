import { TableColumn, TableSort, TableState } from "./types";

// Get row key from row data
export const getRowKey = <T>(
  row: T,
  index: number,
  rowKey?: keyof T | ((row: T) => string | number)
): string | number => {
  if (typeof rowKey === "function") {
    return rowKey(row);
  }
  if (typeof rowKey === "string" && rowKey in (row as object)) {
    return (row as any)[rowKey];
  }
  return index;
};

// Filter data based on search term
export const filterData = <T>(
  data: T[],
  searchTerm: string,
  columns: TableColumn<T>[],
  searchKeys?: (keyof T)[]
): T[] => {
  if (!searchTerm) return data;

  const keysToSearch = searchKeys || columns.map(col => col.key as keyof T);
  
  return data.filter((row) =>
    keysToSearch.some((key) => {
      const value = (row as any)[key];
      return value && value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  );
};

// Sort data based on sort configuration
export const sortData = <T>(
  data: T[],
  sort: TableSort | null,
  columns: TableColumn<T>[]
): T[] => {
  if (!sort) return data;

  const column = columns.find(col => col.key === sort.key);
  if (!column) return data;

  return [...data].sort((a, b) => {
    const aValue = (a as any)[sort.key];
    const bValue = (b as any)[sort.key];

    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sort.direction === "asc" ? -1 : 1;
    if (bValue == null) return sort.direction === "asc" ? 1 : -1;

    // Handle different data types
    let comparison = 0;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      comparison = aValue.localeCompare(bValue);
    } else if (typeof aValue === "number" && typeof bValue === "number") {
      comparison = aValue - bValue;
    } else if (aValue instanceof Date && bValue instanceof Date) {
      comparison = aValue.getTime() - bValue.getTime();
    } else {
      comparison = String(aValue).localeCompare(String(bValue));
    }

    return sort.direction === "asc" ? comparison : -comparison;
  });
};

// Paginate data
export const paginateData = <T>(
  data: T[],
  page: number,
  pageSize: number
): T[] => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return data.slice(startIndex, endIndex);
};

// Calculate pagination info
export const getPaginationInfo = (
  total: number,
  page: number,
  pageSize: number
) => {
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, total);
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    startItem,
    endItem,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

// Generate page numbers for pagination
export const generatePageNumbers = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): (number | string)[] => {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | string)[] = [];
  const half = Math.floor(maxVisible / 2);

  if (currentPage <= half) {
    // Show first pages
    for (let i = 1; i <= maxVisible - 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  } else if (currentPage >= totalPages - half) {
    // Show last pages
    pages.push(1);
    pages.push("...");
    for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Show middle pages
    pages.push(1);
    pages.push("...");
    for (let i = currentPage - half + 1; i <= currentPage + half - 1; i++) {
      pages.push(i);
    }
    pages.push("...");
    pages.push(totalPages);
  }

  return pages;
};

// Check if row is selected
export const isRowSelected = <T>(
  row: T,
  index: number,
  selectedRowKeys: (string | number)[],
  getRowKey: (row: T, index: number) => string | number
): boolean => {
  const rowKey = getRowKey(row, index);
  return selectedRowKeys.includes(rowKey);
};

// Toggle row selection
export const toggleRowSelection = <T>(
  row: T,
  index: number,
  selectedRowKeys: (string | number)[],
  getRowKey: (row: T, index: number) => string | number
): (string | number)[] => {
  const rowKey = getRowKey(row, index);
  const isSelected = selectedRowKeys.includes(rowKey);
  
  if (isSelected) {
    return selectedRowKeys.filter(key => key !== rowKey);
  } else {
    return [...selectedRowKeys, rowKey];
  }
};

// Select all rows
export const selectAllRows = <T>(
  data: T[],
  getRowKey: (row: T, index: number) => string | number
): (string | number)[] => {
  return data.map((row, index) => getRowKey(row, index));
};

// Clear all selections
export const clearAllSelections = (): (string | number)[] => {
  return [];
};

// Get visible columns
export const getVisibleColumns = <T>(columns: TableColumn<T>[]): TableColumn<T>[] => {
  return columns.filter(column => !column.hidden);
};

// Get sticky columns
export const getStickyColumns = <T>(columns: TableColumn<T>[]): {
  left: TableColumn<T>[];
  right: TableColumn<T>[];
  normal: TableColumn<T>[];
} => {
  const left: TableColumn<T>[] = [];
  const right: TableColumn<T>[] = [];
  const normal: TableColumn<T>[] = [];

  columns.forEach(column => {
    if (column.sticky === "left") {
      left.push(column);
    } else if (column.sticky === "right") {
      right.push(column);
    } else {
      normal.push(column);
    }
  });

  return { left, right, normal };
};

// Format cell value for display
export const formatCellValue = (value: any): string => {
  if (value == null) return "";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "number") return value.toLocaleString();
  return String(value);
};

// Get column width style
export const getColumnWidthStyle = (width?: string | number): React.CSSProperties => {
  if (!width) return {};
  if (typeof width === "number") return { width: `${width}px` };
  return { width };
};

// Get sticky column style
export const getStickyColumnStyle = (
  sticky?: "left" | "right",
  leftOffset?: number,
  rightOffset?: number
): React.CSSProperties => {
  if (!sticky) return {};
  
  const style: React.CSSProperties = {
    position: "sticky",
    zIndex: 10,
  };

  if (sticky === "left") {
    style.left = leftOffset || 0;
  } else if (sticky === "right") {
    style.right = rightOffset || 0;
  }

  return style;
};

// Debounce function for search
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function for scroll events
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};

// Export data to CSV
export const exportToCSV = <T>(
  data: T[],
  columns: TableColumn<T>[],
  filename: string = "data.csv"
): void => {
  const visibleColumns = getVisibleColumns(columns);
  const headers = visibleColumns.map(col => col.label);
  const rows = data.map(row =>
    visibleColumns.map(col => {
      const value = (row as any)[col.key];
      return `"${formatCellValue(value).replace(/"/g, '""')}"`;
    })
  );

  const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
  
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Get table classes
export const getTableClasses = (options: {
  size?: "sm" | "md" | "lg";
  striped?: boolean;
  bordered?: boolean;
  hoverable?: boolean;
}): string => {
  const classes = ["w-full"];
  
  if (options.bordered) {
    classes.push("border admin-border-primary");
  }
  
  if (options.striped) {
    classes.push("divide-y admin-border-primary");
  }
  
  if (options.hoverable) {
    classes.push("hover:admin-hover-bg");
  }
  
  return classes.join(" ");
};

// Get row classes
export const getRowClasses = (options: {
  striped?: boolean;
  hoverable?: boolean;
  selected?: boolean;
  customClassName?: string;
}): string => {
  const classes = ["transition-colors duration-150"];
  
  if (options.striped) {
    classes.push("even:admin-bg-tertiary/50");
  }
  
  if (options.hoverable) {
    classes.push("hover:admin-hover-bg");
  }
  
  if (options.selected) {
    classes.push("bg-blue-50 dark:bg-blue-900/20");
  }
  
  if (options.customClassName) {
    classes.push(options.customClassName);
  }
  
  return classes.join(" ");
};
