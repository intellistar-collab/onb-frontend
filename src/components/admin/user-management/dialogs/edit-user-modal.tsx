"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, User, MapPin, Settings, Image as ImageIcon } from "lucide-react";
import { User as UserType } from "@/lib/api/users";
import { useUserForm } from "@/lib/admin/user-form";
import { useUserOperations } from "@/lib/admin/user-operations";
import { Stepper } from "@/components/ui/stepper";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserType | null;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const { formData, setFormData, resetForm, setFormDataForEdit } = useUserForm();
  const { editUser } = useUserOperations();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: "avatar",
      title: "Avatar",
      description: "Update profile picture"
    },
    {
      id: "basic",
      title: "Basic Info",
      description: "Personal details"
    },
    {
      id: "address",
      title: "Address",
      description: "Location information"
    },
    {
      id: "account",
      title: "Account",
      description: "Login credentials"
    }
  ];

  useEffect(() => {
    if (user && isOpen) {
      setFormDataForEdit(user);
      setCurrentStep(0);
    }
  }, [user, isOpen, setFormDataForEdit]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      resetForm();
      setCurrentStep(0);
    }
  }, [isOpen, resetForm]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      await editUser(user.id, formData, async () => {
        onSuccess();
        onClose();
        resetForm();
        setCurrentStep(0);
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canGoNext = () => {
    switch (currentStep) {
      case 0: // Avatar - optional
        return true;
      case 1: // Basic Info
        return formData.firstName.trim() !== "" && formData.lastName.trim() !== "" && 
               formData.username.trim() !== "" && formData.email.trim() !== "";
      case 2: // Address - optional
        return true;
      case 3: // Account
        return (formData.password.trim() === "" && formData.confirmPassword.trim() === "") ||
               (formData.password.trim() !== "" && formData.confirmPassword.trim() !== "" &&
                formData.password === formData.confirmPassword);
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Avatar
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Profile Picture</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Update the user's profile picture (optional)
              </p>
            </div>
            
            <AvatarUpload
              value={formData.avatar}
              onChange={(value) => handleInputChange('avatar', value)}
              className="mx-auto"
            />
          </div>
        );

      case 1: // Basic Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Basic Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update the user's personal details
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Username *</label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Mobile</label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mobile', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter mobile number (10-15 digits)"
                />
                {formData.mobile && formData.mobile.trim() !== "" && (formData.mobile.length < 10 || formData.mobile.length > 15) && (
                  <p className="text-sm text-red-500 mt-1">Mobile number must be between 10 and 15 characters</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('dob', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 2: // Address
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Address Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update the user's address details (optional)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">Full Address</label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Street Number/Name</label>
                <Input
                  type="text"
                  value={formData.streetNumberOrName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('streetNumberOrName', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Street</label>
                <Input
                  type="text"
                  value={formData.street}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('street', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">City</label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">ZIP Code</label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Country</label>
                <Input
                  type="text"
                  value={formData.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('country', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Account
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Settings className="w-12 h-12 text-purple-500 mx-auto mb-2" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Account Information</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update login credentials and account settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">New Password (optional)</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Leave blank to keep current password"
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select
                  value={formData.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('role', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <Stepper
            steps={steps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onFinish={handleFinish}
            canGoNext={canGoNext()}
            canGoPrevious={currentStep > 0}
            isLoading={isLoading}
          />
          
          <div className="min-h-[400px]">
            {renderStepContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};