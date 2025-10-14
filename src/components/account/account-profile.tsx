"use client";

import { useState, useEffect } from "react";
import { profileAPI, UserProfile, UpdateProfileData } from "@/lib/api/account";

export default function AccountProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formData, setFormData] = useState<UpdateProfileData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    mobile: "",
    dob: "",
    address: "",
    streetNumberOrName: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    location: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const profileData = await profileAPI.getProfile();
        setProfile(profileData);
        setFormData({
          firstName: profileData.firstName || "",
          lastName: profileData.lastName || "",
          username: profileData.username,
          email: profileData.email,
          mobile: profileData.mobile || "",
          dob: profileData.dob ? new Date(profileData.dob).toISOString().split('T')[0] : "",
          address: profileData.address || "",
          streetNumberOrName: profileData.streetNumberOrName || "",
          street: profileData.street || "",
          city: profileData.city || "",
          state: profileData.state || "",
          zipCode: profileData.zipCode || "",
          country: profileData.country || "",
          location: profileData.location || "",
          gender: profileData.gender || "",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      // Prepare data for API - convert date to ISO format if provided
      const apiData = {
        ...formData,
        dob: formData.dob && formData.dob.trim() !== "" 
          ? new Date(formData.dob).toISOString() 
          : ""
      };

      const updatedProfile = await profileAPI.updateProfile(apiData);
      setProfile(updatedProfile);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-10 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-green-600 dark:text-green-400 text-sm">{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="First Name"
            required
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Last Name"
            required
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Username"
            required
          />
        </div>
        
        <div>
          <input 
            type="email" 
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Email Address"
            required
          />
        </div>
        
        <div>
          <input 
            type="tel" 
            name="mobile"
            value={formData.mobile}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Mobile Number"
          />
        </div>
        
        <div>
          <input 
            type="date" 
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Date of Birth"
          />
        </div>
        
        <div>
          <select 
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer_not_to_say">Prefer not to say</option>
          </select>
        </div>
        
        <div>
          <input 
            type="text" 
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Location"
          />
        </div>
        
        <div className="md:col-span-2">
          <input 
            type="text" 
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Full Address"
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="streetNumberOrName"
            value={formData.streetNumberOrName}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Street Number or Name"
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="street"
            value={formData.street}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Street"
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="City"
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="State/Province"
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="ZIP/Postal Code"
          />
        </div>
        
        <div>
          <input 
            type="text" 
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Country"
          />
        </div>
      </div>
      
      <button 
        type="submit"
        disabled={saving}
        className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
}
