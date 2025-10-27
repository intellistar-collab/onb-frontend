"use client";

import React from "react";
import { DataTable, TableColumn, TableAction } from "@/components/ui/table";

// Legacy interfaces for backward compatibility
interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
  className?: string;
}

interface Action {
  label: string;
  icon: React.ReactNode;
  onClick: (row: any) => void;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  show?: (row: any) => boolean;
}

interface AdminTableProps {
  title: string;
  description?: string;
  data: any[];
  columns: Column[];
  actions?: Action[];
  className?: string;
  emptyMessage?: string;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  pageSize?: number;
  showPagination?: boolean;
  statusFilter?: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
  };
}

// Convert legacy column format to new format
const convertColumns = (columns: Column[]): TableColumn[] => {
  return columns.map(col => ({
    key: col.key,
    label: col.label,
    render: col.render,
    className: col.className,
  }));
};

// Convert legacy action format to new format
const convertActions = (actions: Action[]): TableAction[] => {
  return actions.map(action => ({
    label: action.label,
    icon: action.icon,
    onClick: action.onClick,
    variant: action.variant,
    className: action.className,
    show: action.show,
  }));
};

export const AdminTable: React.FC<AdminTableProps> = ({
  title,
  description,
  data,
  columns,
  actions,
  className,
  emptyMessage = "No data available",
  loading = false,
  searchable = true,
  searchPlaceholder = "Search...",
  pageSize = 10,
  showPagination = true,
  statusFilter,
}) => {
  // Convert legacy formats to new formats
  const tableColumns = convertColumns(columns);
  const tableActions = actions ? convertActions(actions) : undefined;

  // Convert pagination format
  const pagination = showPagination ? {
    page: 1,
    pageSize,
    total: data.length,
    showSizeChanger: false,
    showQuickJumper: false,
  } : false;

  return (
    <DataTable
      data={data}
      columns={tableColumns}
      actions={tableActions}
      title={title}
      description={description}
      loading={loading}
      emptyMessage={emptyMessage}
      searchable={searchable}
      searchPlaceholder={searchPlaceholder}
      pagination={pagination}
      statusFilter={statusFilter}
      striped={true}
      hoverable={true}
      size="md"
      className={className}
    />
  );
};
