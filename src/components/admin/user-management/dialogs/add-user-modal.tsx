"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, User, MapPin, Settings, Image as ImageIcon } from "lucide-react";
import { useUserForm } from "@/lib/admin/user-form";
import { useUserOperations } from "@/lib/admin/user-operations";
import { Stepper } from "@/components/ui/stepper";
import { AvatarUpload } from "@/components/ui/avatar-upload";

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { formData, setFormData, resetForm } = useUserForm();
  const { addUser } = useUserOperations();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    {
      id: "avatar",
      title: "Avatar",
      description: "Set profile picture"
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
    setIsLoading(true);
    try {
      await addUser(formData, async () => {
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
        return formData.password.trim() !== "" && formData.confirmPassword.trim() !== "" &&
               formData.password === formData.confirmPassword;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Avatar
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-1">Profile Picture</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Add a profile picture for the user (optional)
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
          <div className="space-y-4">
            <div className="text-center mb-4">
              <User className="w-8 h-8 text-blue-500 mx-auto mb-1" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Basic Information</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter the user's personal details
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">First Name *</label>
                <Input
                  type="text"
                  value={formData.firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('firstName', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Last Name *</label>
                <Input
                  type="text"
                  value={formData.lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('lastName', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Username *</label>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('username', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Email *</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('email', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Mobile</label>
                <Input
                  type="tel"
                  value={formData.mobile}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('mobile', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="Enter mobile number (10-15 digits)"
                />
                {formData.mobile && formData.mobile.trim() !== "" && (formData.mobile.length < 10 || formData.mobile.length > 15) && (
                  <p className="text-sm text-red-500 mt-1">Mobile number must be between 10 and 15 characters</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Date of Birth</label>
                <Input
                  type="date"
                  value={formData.dob}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('dob', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('gender', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
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
          <div className="space-y-4">
            <div className="text-center mb-4">
              <MapPin className="w-8 h-8 text-green-500 mx-auto mb-1" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Address Information</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Enter the user's address details (optional)
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium mb-1">Full Address</label>
                <Input
                  type="text"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('address', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Street Number/Name</label>
                <Input
                  type="text"
                  value={formData.streetNumberOrName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('streetNumberOrName', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Street</label>
                <Input
                  type="text"
                  value={formData.street}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('street', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">City</label>
                <Input
                  type="text"
                  value={formData.city}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('city', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">State</label>
                <Input
                  type="text"
                  value={formData.state}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('state', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">ZIP Code</label>
                <Input
                  type="text"
                  value={formData.zipCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('zipCode', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Country</label>
                <Input
                  type="text"
                  value={formData.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('country', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Location</label>
                <Input
                  type="text"
                  value={formData.location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('location', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        );

      case 3: // Account
        return (
          <div className="space-y-4">
            <div className="text-center mb-4">
              <Settings className="w-8 h-8 text-purple-500 mx-auto mb-1" />
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Account Information</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Set up login credentials and account settings
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Password *</label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('password', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Confirm Password *</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('status', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="PENDING">Pending</option>
                  <option value="ACTIVE">Active</option>
                  <option value="DISABLED">Disabled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Role</label>
                <select
                  value={formData.role}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('role', e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
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
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="pb-3">
          <DialogTitle className="text-lg">Add New User</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
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
          
          <div className="min-h-[300px]">
            {renderStepContent()}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
