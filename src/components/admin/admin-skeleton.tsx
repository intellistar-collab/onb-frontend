"use client";

import React from "react";
import { cn } from "@/lib/utils";

// Base skeleton component
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200 dark:bg-slate-700", className)}
      {...props}
    />
  );
};

// Admin page header skeleton
export const AdminPageHeaderSkeleton = () => {
  return (
    <div className="mb-8">
      <Skeleton className="h-8 w-64 mb-2" />
      <Skeleton className="h-4 w-96" />
    </div>
  );
};

// Admin stats skeleton
export const AdminStatsSkeleton = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="admin-card p-3 sm:p-6">
          <div className="flex flex-col items-center text-center space-y-2 sm:space-y-3">
            <div className="flex-shrink-0">
              <Skeleton className="w-8 h-8 sm:w-12 sm:h-12 rounded-full" />
            </div>
            <div className="flex-1 w-full">
              <Skeleton className="h-3 w-20 mx-auto mb-2" />
              <Skeleton className="h-6 w-16 mx-auto mb-1" />
              <Skeleton className="h-3 w-24 mx-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Admin table skeleton
export const AdminTableSkeleton = ({ 
  title, 
  description, 
  showSearch = true,
  showActions = true,
  rowCount = 5 
}: {
  title?: string;
  description?: string;
  showSearch?: boolean;
  showActions?: boolean;
  rowCount?: number;
}) => {
  return (
    <div className="admin-card">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b admin-border-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && <Skeleton className="h-6 w-48 mb-2" />}
            {description && <Skeleton className="h-4 w-64" />}
          </div>
          {showActions && (
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-20" />
            </div>
          )}
        </div>
        
        {/* Search bar */}
        {showSearch && (
          <div className="mt-4">
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        )}
      </div>

      {/* Table content */}
      <div className="p-4 sm:p-6">
        <div className="overflow-x-auto admin-table-scroll">
          <table className="w-full">
            <thead>
              <tr className="border-b admin-border-primary">
                {Array.from({ length: 4 }).map((_, index) => (
                  <th key={index} className="text-left py-3 px-2">
                    <Skeleton className="h-4 w-16" />
                  </th>
                ))}
                {showActions && (
                  <th className="text-right py-3 px-2">
                    <Skeleton className="h-4 w-12 ml-auto" />
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: rowCount }).map((_, rowIndex) => (
                <tr key={rowIndex} className="border-b admin-border-primary">
                  {Array.from({ length: 4 }).map((_, colIndex) => (
                    <td key={colIndex} className="py-4 px-2">
                      <div className="flex items-center space-x-3">
                        {colIndex === 0 && (
                          <Skeleton className="w-8 h-8 rounded-full" />
                        )}
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </td>
                  ))}
                  {showActions && (
                    <td className="text-right py-4 px-2">
                      <div className="flex justify-end space-x-2">
                        <Skeleton className="h-8 w-8 rounded" />
                        <Skeleton className="h-8 w-8 rounded" />
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Admin card skeleton
export const AdminCardSkeleton = ({ 
  showHeader = true,
  showActions = false 
}: {
  showHeader?: boolean;
  showActions?: boolean;
}) => {
  return (
    <div className="admin-card p-4 sm:p-6">
      {showHeader && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <Skeleton className="h-6 w-32" />
            {showActions && (
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            )}
          </div>
          <Skeleton className="h-4 w-48" />
        </div>
      )}
      
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

// Quick actions skeleton
export const AdminQuickActionsSkeleton = () => {
  return (
    <div className="admin-card mb-8">
      <div className="p-4 sm:p-6 border-b admin-border-primary">
        <Skeleton className="h-6 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="flex flex-col items-center p-4 border admin-border-primary rounded-lg">
              <Skeleton className="w-8 h-8 rounded-full mb-2" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Dashboard skeleton
export const AdminDashboardSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeaderSkeleton />
        <AdminStatsSkeleton />
        <AdminQuickActionsSkeleton />
        
        <div className="space-y-6">
          <AdminTableSkeleton 
            title="Recent Users" 
            description="Latest user registrations"
            rowCount={5}
          />
          <AdminTableSkeleton 
            title="Recent Boxes" 
            description="Latest mystery boxes created"
            rowCount={5}
          />
        </div>
      </div>
    </div>
  );
};

// Users page skeleton
export const AdminUsersSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeaderSkeleton />
        <AdminTableSkeleton 
          title="Users" 
          description="Manage user accounts and permissions"
          showSearch={true}
          showActions={true}
          rowCount={8}
        />
      </div>
    </div>
  );
};

// Items page skeleton
export const AdminItemsSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeaderSkeleton />
        <AdminTableSkeleton 
          title="Items" 
          description="Manage mystery box items"
          showSearch={true}
          showActions={true}
          rowCount={8}
        />
      </div>
    </div>
  );
};

// Boxes page skeleton
export const AdminBoxesSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeaderSkeleton />
        <AdminTableSkeleton 
          title="Boxes" 
          description="Manage mystery boxes"
          showSearch={true}
          showActions={true}
          rowCount={8}
        />
      </div>
    </div>
  );
};

// Box categories skeleton
export const AdminBoxCategoriesSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeaderSkeleton />
        <AdminTableSkeleton 
          title="Box Categories" 
          description="Manage box categories"
          showSearch={true}
          showActions={true}
          rowCount={6}
        />
      </div>
    </div>
  );
};

// Settings page skeleton
export const AdminSettingsSkeleton = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <AdminPageHeaderSkeleton />
        
        <div className="space-y-6">
          <AdminCardSkeleton showHeader={true} showActions={false} />
          <AdminCardSkeleton showHeader={true} showActions={false} />
          <AdminCardSkeleton showHeader={true} showActions={false} />
        </div>
      </div>
    </div>
  );
};

export { Skeleton };
