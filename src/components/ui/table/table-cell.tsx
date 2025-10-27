"use client";

import React from "react";
import { TableCellProps } from "./types";
import { formatCellValue } from "./utils";
import { cn } from "@/lib/utils";

export function TableCell<T = any>({
  column,
  row,
  index,
  value,
}: TableCellProps<T>) {
  const { key, render, className, align = "left" } = column;

  // Render custom content if render function is provided
  if (render) {
    return (
      <td
        className={cn(
          "py-3 px-4 text-sm",
          {
            "text-left": align === "left",
            "text-center": align === "center",
            "text-right": align === "right",
          },
          className
        )}
      >
        {render(value, row, index)}
      </td>
    );
  }

  // Render default content
  const displayValue = formatCellValue(value);

  return (
    <td
      className={cn(
        "py-3 px-4 text-sm",
        {
          "text-left": align === "left",
          "text-center": align === "center",
          "text-right": align === "right",
        },
        className
      )}
    >
      {displayValue}
    </td>
  );
}
