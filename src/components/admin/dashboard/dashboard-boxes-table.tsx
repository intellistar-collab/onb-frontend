"use client";

import React from "react";
import { AdminTable } from "@/components/admin";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Image as ImageIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Box } from "@/hooks";

// Define types locally for dashboard components
interface DashboardBox {
  id: string;
  title: string;
  description?: string;
  price: number;
  status: string;
  createdAt: Date;
  imageUrl?: string;
}

interface DashboardBoxesTableProps {
  boxes: DashboardBox[];
  expandedDescriptions: Set<string>;
  onToggleDescriptionExpansion: (boxId: string) => void;
}

export const DashboardBoxesTable: React.FC<DashboardBoxesTableProps> = ({
  boxes,
  expandedDescriptions,
  onToggleDescriptionExpansion,
}) => {
  const router = useRouter();

  const boxColumns = [
    {
      key: "order",
      label: "#",
      className: "w-1/8 text-center",
      render: (value: any, row: any) => (
        <span className="admin-text-primary font-medium">
          {boxes.findIndex(box => box.id === row.id) + 1}
        </span>
      ),
    },
    {
      key: "box",
      label: "Box",
      className: "w-3/8",
      render: (value: any, row: any) => (
        <div className="flex items-start space-x-4">
          {row.imageUrl ? (
            <Image
              src={row.imageUrl}
              alt={row.title}
              width={80}
              height={80}
              className="w-20 h-20 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
              <ImageIcon className="h-8 w-8 text-slate-400" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p 
              className="admin-text-primary font-bold truncate cursor-pointer text-blue-600 dark:text-blue-600 transition-colors"
              onClick={() => router.push(`/admin/boxes/${row.id}`)}
              title="Click to view box details and manage items"
            >
              {row.title}
            </p>
            {row.description ? (
              <div className="mt-1">
                <p className={`admin-text-secondary text-sm ${
                  expandedDescriptions.has(row.id) ? '' : 'line-clamp-2'
                }`}>
                  {row.description}
                </p>
                {row.description.length > 100 && (
                  <button
                    onClick={() => onToggleDescriptionExpansion(row.id)}
                    className="text-blue-600 dark:text-blue-400 text-xs font-medium mt-1 hover:underline"
                  >
                    {expandedDescriptions.has(row.id) ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            ) : (
              <p className="admin-text-tertiary text-sm italic">No description</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "price",
      label: "Price",
      className: "w-1/8",
      render: (value: number) => (
        <span className="admin-text-primary font-semibold">
          ${value.toFixed(2)}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      className: "w-1/8",
      render: (value: string) => {
        const getStatusConfig = (status: string) => {
          switch (status) {
            case "ACTIVE":
              return {
                dotColor: "bg-green-500",
                textColor: "text-green-700 dark:text-green-400",
                bgColor: "bg-green-50 dark:bg-green-900/20",
                borderColor: "border-green-200 dark:border-green-800",
              };
            case "DRAFT":
              return {
                dotColor: "bg-yellow-500",
                textColor: "text-yellow-700 dark:text-yellow-400",
                bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
                borderColor: "border-yellow-200 dark:border-yellow-800",
              };
            case "DISABLED":
              return {
                dotColor: "bg-red-500",
                textColor: "text-red-700 dark:text-red-400",
                bgColor: "bg-red-50 dark:bg-red-900/20",
                borderColor: "border-red-200 dark:border-red-800",
              };
            default:
              return {
                dotColor: "bg-gray-500",
                textColor: "text-gray-700 dark:text-gray-400",
                bgColor: "bg-gray-50 dark:bg-gray-900/20",
                borderColor: "border-gray-200 dark:border-gray-800",
              };
          }
        };

        const config = getStatusConfig(value);
        
        return (
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.bgColor} ${config.borderColor}`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${config.dotColor}`}></div>
            <span className={config.textColor}>{value}</span>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Created",
      className: "w-1/8",
      render: (value: Date) => (
        <span className="admin-text-tertiary text-sm">
          {new Date(value).toLocaleDateString()}
        </span>
      ),
    },
  ];

  const boxActions = [
    {
      label: "View",
      icon: <Eye className="h-4 w-4" />,
      onClick: (box: Box) => router.push(`/admin/boxes/${box.id}`),
    },
    // {
    //   label: "Edit",
    //   icon: <Edit className="h-4 w-4" />,
    //   onClick: (box: Box) => router.push(`/admin/boxes/${box.id}/edit`),
    // },
    // {
    //   label: "Delete",
    //   icon: <Trash2 className="h-4 w-4" />,
    //   onClick: (box: Box) => {
    //     // TODO: Implement delete functionality
    //     console.log("Delete box:", box.id);
    //   },
    //   className: "text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300",
    // },
  ];

  return (
    <AdminTable
      title="Recent Boxes"
      description="Latest mystery boxes created"
      data={boxes}
      columns={boxColumns}
      actions={boxActions}
      emptyMessage="No recent boxes"
    />
  );
};
