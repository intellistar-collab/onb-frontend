"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";
import { User } from "@/lib/api/users";
import { useUserOperations } from "@/lib/admin/user-operations";

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const { deleteUser } = useUserOperations();

  const handleDelete = async () => {
    if (!user) return;
    
    await deleteUser(user.id, async () => {
      onSuccess();
      onClose();
    });
  };

  if (!user) return null;

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete User</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                Are you sure you want to delete this user?
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              This action cannot be undone. The following user will be permanently deleted:
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <p className="font-medium text-slate-900 dark:text-slate-100">
                {fullName}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {user.email}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                @{user.username}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
