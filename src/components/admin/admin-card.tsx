"use client";

import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AdminCardProps {
  children: React.ReactNode;
  className?: string;
  header?: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
  };
}

export const AdminCard: React.FC<AdminCardProps> = ({
  children,
  className,
  header,
}) => {
  return (
    <Card className={cn("admin-card", className)}>
      {header && (
        <CardHeader>
          <CardTitle className="admin-card-header flex items-center gap-2">
            {header.icon}
            {header.title}
          </CardTitle>
          {header.description && (
            <CardDescription className="admin-card-description">
              {header.description}
            </CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  );
};
