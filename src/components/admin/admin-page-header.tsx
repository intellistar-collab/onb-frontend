"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface AdminPageHeaderProps {
  title: string;
  description?: string;
  showBackButton?: boolean;
  backUrl?: string;
  actions?: React.ReactNode;
  className?: string;
}

export const AdminPageHeader: React.FC<AdminPageHeaderProps> = ({
  title,
  description,
  showBackButton = false,
  backUrl = "/admin/dashboard",
  actions,
  className,
}) => {
  const router = useRouter();

  return (
    <div className={cn("flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4", className)}>
      <div className="flex items-center gap-4">
        {showBackButton && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(backUrl)}
            className="admin-button-secondary flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
        <div>
          <h1 className="admin-text-primary text-3xl font-bold mb-2">
            {title}
          </h1>
          {description && (
            <p className="admin-text-tertiary">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
};
