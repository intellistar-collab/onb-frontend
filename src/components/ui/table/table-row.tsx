"use client";

import React from "react";
import { TableRowProps } from "./types";
import { TableCell } from "./table-cell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getRowClasses } from "./utils";

export function TableRow<T = any>({
  row,
  index,
  columns,
  actions,
  rowKey,
  selected,
  hoverable,
  striped,
  onRowClick,
  onRowDoubleClick,
  onActionClick,
}: TableRowProps<T>) {
  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  const handleRowDoubleClick = () => {
    if (onRowDoubleClick) {
      onRowDoubleClick(row, index);
    }
  };

  const handleActionClick = (action: any) => {
    onActionClick(action, row, index);
  };

  const rowClassName = getRowClasses({
    striped,
    hoverable,
    selected,
  });

  return (
    <tr
      key={rowKey}
      className={cn(
        rowClassName,
        {
          "cursor-pointer": onRowClick,
        }
      )}
      onClick={handleRowClick}
      onDoubleClick={handleRowDoubleClick}
    >
      {columns.map((column) => (
        <TableCell
          key={column.key}
          column={column}
          row={row}
          index={index}
          value={(row as any)[column.key]}
        />
      ))}
      {actions && actions.length > 0 && (
        <td className="px-4 py-3 w-32">
          <div className="flex items-center gap-1">
            {actions.map((action, actionIndex) => {
              // Check if action should be shown
              if (action.show && !action.show(row, index)) {
                return null;
              }

              // Check if action is disabled
              const isDisabled = action.disabled ? action.disabled(row, index) : false;

              return (
                <Button
                  key={actionIndex}
                  variant={action.variant || "ghost"}
                  size="sm"
                  onClick={() => handleActionClick(action)}
                  disabled={isDisabled}
                  className={cn(
                    "h-8 w-8 p-0 rounded-lg",
                    "hover:admin-hover-bg",
                    "admin-text-tertiary hover:admin-text-primary",
                    "transition-all duration-150",
                    action.className
                  )}
                  title={action.tooltip}
                >
                  {action.icon}
                </Button>
              );
            })}
          </div>
        </td>
      )}
    </tr>
  );
}
