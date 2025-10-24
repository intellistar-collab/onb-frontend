import { useState, useCallback } from "react";

export interface UserFormData {
  // Basic Info
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  mobile: string;
  dob: string;
  gender: string;
  avatar: string;
  
  // Address
  address: string;
  streetNumberOrName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  location: string;
  
  // Account
  password: string;
  confirmPassword: string;
  status: string;
  role: string;
}

export const useUserForm = () => {
  const [formData, setFormData] = useState<UserFormData>({
    // Basic Info
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobile: "",
    dob: "",
    gender: "male",
    avatar: "",
    
    // Address
    address: "",
    streetNumberOrName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    location: "",
    
    // Account
    password: "",
    confirmPassword: "",
    status: "PENDING",
    role: "USER",
  });


  const updateFormData = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const setFormDataForEdit = useCallback((user: any) => {
    setFormData({
      // Basic Info
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      username: user.username || "",
      email: user.email || "",
      mobile: user.mobile || "",
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : "",
      gender: user.gender || "",
      avatar: user.avatar || "",
      
      // Address
      address: user.address || "",
      streetNumberOrName: user.streetNumberOrName || "",
      street: user.street || "",
      city: user.city || "",
      state: user.state || "",
      zipCode: user.zipCode || "",
      country: user.country || "",
      location: user.location || "",
      
      // Account
      password: "",
      confirmPassword: "",
      status: user.status || "PENDING",
      role: user.role || "USER",
    });
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      // Basic Info
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      mobile: "",
      dob: "",
      gender: "male",
      avatar: "",
      
      // Address
      address: "",
      streetNumberOrName: "",
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      location: "",
      
      // Account
      password: "",
      confirmPassword: "",
      status: "PENDING",
      role: "USER",
    });
  }, []);

  return {
    formData,
    setFormData,
    resetForm,
    updateFormData,
    setFormDataForEdit,
  };
};
