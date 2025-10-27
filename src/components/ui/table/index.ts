// Export all table components and types
export * from "./types";
export * from "./utils";
export * from "./table-context";
export * from "./table-cell";
export * from "./table-header";
export * from "./table-row";
export * from "./table-footer";
export * from "./base-table";
export * from "./data-table";
export * from "./simple-table";

// Re-export commonly used components with shorter names
export { BaseTable as Table } from "./base-table";
export { DataTable as AdvancedTable } from "./data-table";
export { SimpleTable as BasicTable } from "./simple-table";
