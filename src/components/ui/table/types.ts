import { ReactNode } from "react";

// Base column definition
export interface TableColumn<T = any> {
  key: string;
  label: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  className?: string;
  width?: string | number;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  hidden?: boolean;
  sticky?: "left" | "right";
}

// Action definition
export interface TableAction<T = any> {
  label: string;
  icon?: ReactNode;
  onClick: (row: T, index: number) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  show?: (row: T, index: number) => boolean;
  disabled?: (row: T, index: number) => boolean;
  tooltip?: string;
}

// Filter definition
export interface TableFilter {
  key: string;
  label: string;
  type: "text" | "select" | "date" | "number" | "boolean";
  options?: { value: string | number; label: string }[];
  placeholder?: string;
  value?: any;
  onChange: (value: any) => void;
}

// Sort definition
export interface TableSort {
  key: string;
  direction: "asc" | "desc";
}

// Pagination definition
export interface TablePagination {
  page: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  showQuickJumper?: boolean;
  showTotal?: (total: number, range: [number, number]) => string;
}

// Selection definition
export interface TableSelection<T = any> {
  selectedRowKeys: (string | number)[];
  onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void;
  getCheckboxProps?: (row: T) => { disabled?: boolean; name?: string };
  type?: "checkbox" | "radio";
}

// Base table props
export interface BaseTableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: ReactNode;
  rowKey?: keyof T | ((row: T) => string | number);
  rowClassName?: (row: T, index: number) => string;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  size?: "sm" | "md" | "lg";
  stickyHeader?: boolean;
  stickyActions?: boolean;
}

// Data table props (with advanced features)
export interface DataTableProps<T = any> extends BaseTableProps<T> {
  title?: string;
  description?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T)[];
  filters?: TableFilter[];
  sortable?: boolean;
  defaultSort?: TableSort;
  onSort?: (sort: TableSort) => void;
  pagination?: TablePagination | false;
  onPageChange?: (page: number, pageSize: number) => void;
  selection?: TableSelection<T>;
  exportable?: boolean;
  onExport?: (data: T[]) => void;
  exportFormats?: ("csv" | "excel" | "pdf")[];
  refreshable?: boolean;
  onRefresh?: () => void;
  refreshLoading?: boolean;
  statusFilter?: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
  };
}

// Simple table props (minimal features)
export interface SimpleTableProps<T = any> extends BaseTableProps<T> {
  title?: string;
  description?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
}

// Table state
export interface TableState {
  searchTerm: string;
  currentPage: number;
  pageSize: number;
  sort: TableSort | null;
  filters: Record<string, any>;
  selectedRowKeys: (string | number)[];
}

// Table context
export interface TableContextValue<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  state: TableState;
  updateState: (updates: Partial<TableState>) => void;
  getRowKey: (row: T, index: number) => string | number;
  isSelected: (row: T, index: number) => boolean;
  toggleSelection: (row: T, index: number) => void;
  selectAll: () => void;
  clearSelection: () => void;
}

// Table cell props
export interface TableCellProps<T = any> {
  column: TableColumn<T>;
  row: T;
  index: number;
  value: any;
}

// Table row props
export interface TableRowProps<T = any> {
  row: T;
  index: number;
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  rowKey: string | number;
  selected: boolean;
  hoverable: boolean;
  striped: boolean;
  onRowClick?: (row: T, index: number) => void;
  onRowDoubleClick?: (row: T, index: number) => void;
  onActionClick: (action: TableAction<T>, row: T, index: number) => void;
}

// Table header props
export interface TableHeaderProps<T = any> {
  columns: TableColumn<T>[];
  actions?: TableAction<T>[];
  sortable: boolean;
  sort: TableSort | null;
  onSort: (key: string) => void;
  sticky: boolean;
}

// Table footer props
export interface TableFooterProps<T = any> {
  pagination?: TablePagination | false;
  onPageChange?: (page: number, pageSize: number) => void;
  selectedCount?: number;
  onClearSelection?: () => void;
}
