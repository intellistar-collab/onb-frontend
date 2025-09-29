"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface UserProfile {
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  mobile?: string;
  dob?: string;
  gender?: string;
  streetNumberOrName?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export default function AccountSettings() {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  // User profile state
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  
  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      marketing: false,
    },
    privacy: {
      showProfile: true,
      showStats: false,
      showActivity: true,
    },
    preferences: {
      theme: "dark",
      language: "en",
      currency: "USD",
    },
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Initialize user profile from session and fetch full profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user) {
        const user = session.user;
        // Set basic info from session
        setUserProfile(prev => ({
          ...prev,
          id: user.id,
          email: user.email || "",
          username: user.username || "",
          avatar: user.image || "",
        }));

        // For now, we'll use the basic info from the session
        // In the future, we can fetch additional profile data from the backend
        // if needed for fields not available in the better-auth session
      }
    };

    fetchUserProfile();
  }, [session]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push('/login');
    }
  }, [session, sessionLoading, router]);

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🛡️" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  const handleNotificationChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof typeof prev.notifications],
      },
    }));
  };

  const handlePrivacyChange = (key: string) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key as keyof typeof prev.privacy],
      },
    }));
  };

  // Clear messages after a delay
  const clearMessages = () => {
    setTimeout(() => {
      setError("");
      setSuccessMessage("");
    }, 5000);
  };

  // Handle profile updates
  const handleProfileUpdate = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      // Use better-auth's built-in user update functionality
      // Note: better-auth may have limited fields available for updates
      const result = await authClient.updateUser({
        name: `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim() || undefined,
        image: userProfile.avatar || undefined,
      });

      if (result.error) {
        setError(result.error.message || "Failed to update profile");
      } else {
        setSuccessMessage("Profile updated successfully!");
        // The session will be automatically updated by better-auth
      }
    } catch (err) {
      setError("An error occurred while updating your profile");
    } finally {
      setIsLoading(false);
      clearMessages();
    }
  };

  // Handle password change
  const handlePasswordChange = async () => {
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match");
      setIsLoading(false);
      clearMessages();
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setIsLoading(false);
      clearMessages();
      return;
    }

    try {
      const result = await authClient.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        setError(result.error.message || "Failed to change password");
      } else {
        setSuccessMessage("Password changed successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      setError("An error occurred while changing your password");
    } finally {
      setIsLoading(false);
      clearMessages();
    }
  };

  // Handle profile input changes
  const handleProfileInputChange = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle password input changes
  const handlePasswordInputChange = (field: keyof typeof passwordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Error and Success Messages */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                <input 
                  type="text" 
                  value={userProfile.firstName || ""}
                  onChange={(e) => handleProfileInputChange("firstName", e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                <input 
                  type="text" 
                  value={userProfile.lastName || ""}
                  onChange={(e) => handleProfileInputChange("lastName", e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username <span className="text-xs text-muted-foreground">(display only)</span></label>
              <input 
                type="text" 
                value={userProfile.username || ""}
                onChange={(e) => handleProfileInputChange("username", e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                placeholder="Enter your username"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address <span className="text-xs text-muted-foreground">(display only)</span></label>
              <input 
                type="email" 
                value={userProfile.email || ""}
                onChange={(e) => handleProfileInputChange("email", e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                placeholder="Enter your email"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Avatar URL</label>
              <input 
                type="url" 
                value={userProfile.avatar || ""}
                onChange={(e) => handleProfileInputChange("avatar", e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter avatar image URL"
              />
              <p className="text-xs text-muted-foreground mt-1">Enter a URL to an image for your profile avatar</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date of Birth <span className="text-xs text-muted-foreground">(display only)</span></label>
                <input 
                  type="date" 
                  value={userProfile.dob || ""}
                  onChange={(e) => handleProfileInputChange("dob", e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Gender <span className="text-xs text-muted-foreground">(display only)</span></label>
                <select 
                  value={userProfile.gender || ""}
                  onChange={(e) => handleProfileInputChange("gender", e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                  disabled
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mobile Number <span className="text-xs text-muted-foreground">(display only)</span></label>
              <input 
                type="tel" 
                value={userProfile.mobile || ""}
                onChange={(e) => handleProfileInputChange("mobile", e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                placeholder="Enter your mobile number"
                disabled
              />
            </div>

            {/* Address Section */}
            <div className="border-t border-border pt-6">
              <h5 className="font-medium text-foreground mb-4">Address Information</h5>
              <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  <strong>Note:</strong> Currently, only the display name (first + last name) and avatar can be updated. 
                  Other fields are shown for reference but cannot be modified through this interface yet.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Street Number/Name</label>
                  <input 
                    type="text" 
                    value={userProfile.streetNumberOrName || ""}
                    onChange={(e) => handleProfileInputChange("streetNumberOrName", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                    placeholder="e.g., 123A"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Street</label>
                  <input 
                    type="text" 
                    value={userProfile.street || ""}
                    onChange={(e) => handleProfileInputChange("street", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                    placeholder="e.g., Main Street"
                    disabled
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">City</label>
                  <input 
                    type="text" 
                    value={userProfile.city || ""}
                    onChange={(e) => handleProfileInputChange("city", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                    placeholder="Enter city"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">State</label>
                  <input 
                    type="text" 
                    value={userProfile.state || ""}
                    onChange={(e) => handleProfileInputChange("state", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                    placeholder="Enter state"
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Zip Code</label>
                  <input 
                    type="text" 
                    value={userProfile.zipCode || ""}
                    onChange={(e) => handleProfileInputChange("zipCode", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                    placeholder="Enter zip code"
                    disabled
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-foreground mb-2">Country</label>
                <input 
                  type="text" 
                  value={userProfile.country || ""}
                  onChange={(e) => handleProfileInputChange("country", e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent opacity-60"
                  placeholder="Enter country"
                  disabled
                />
              </div>
            </div>

            <button 
              onClick={handleProfileUpdate}
              disabled={isLoading}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            {/* Error and Success Messages */}
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-3 rounded-lg">
                {successMessage}
              </div>
            )}

            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Change Password</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                  <input 
                    type="password" 
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordInputChange("currentPassword", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your current password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordInputChange("newPassword", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter your new password (min 6 characters)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordInputChange("confirmPassword", e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Confirm your new password"
                  />
                </div>
              </div>
              <button 
                onClick={handlePasswordChange}
                disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                className="mt-4 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Changing Password..." : "Change Password"}
              </button>
            </div>
            
            <div className="border-t border-border pt-6">
              <h5 className="font-medium text-foreground mb-3">Two-Factor Authentication</h5>
              <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
              <button 
                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                onClick={() => setError("Two-factor authentication is not yet implemented")}
              >
                Enable 2FA (Coming Soon)
              </button>
            </div>

            <div className="border-t border-border pt-6">
              <h5 className="font-medium text-foreground mb-3">Account Security</h5>
              <p className="text-sm text-muted-foreground mb-4">Manage your account security settings</p>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
                  <div>
                    <span className="font-medium text-foreground">Active Sessions</span>
                    <p className="text-sm text-muted-foreground">You are currently signed in on this device</p>
                  </div>
                  <span className="text-xs text-green-500 bg-green-500/10 px-2 py-1 rounded">Current</span>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <h5 className="font-medium text-foreground">Email Notifications</h5>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.email}
                    onChange={() => handleNotificationChange("email")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <h5 className="font-medium text-foreground">Push Notifications</h5>
                  <p className="text-sm text-muted-foreground">Receive push notifications in your browser</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.push}
                    onChange={() => handleNotificationChange("push")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <h5 className="font-medium text-foreground">Marketing Communications</h5>
                  <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.notifications.marketing}
                    onChange={() => handleNotificationChange("marketing")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">Privacy Settings</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <h5 className="font-medium text-foreground">Show Profile Publicly</h5>
                  <p className="text-sm text-muted-foreground">Allow others to view your profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.showProfile}
                    onChange={() => handlePrivacyChange("showProfile")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <h5 className="font-medium text-foreground">Show Statistics</h5>
                  <p className="text-sm text-muted-foreground">Display your gaming statistics publicly</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.showStats}
                    onChange={() => handlePrivacyChange("showStats")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div>
                  <h5 className="font-medium text-foreground">Show Activity</h5>
                  <p className="text-sm text-muted-foreground">Display your recent activity to others</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={settings.privacy.showActivity}
                    onChange={() => handlePrivacyChange("showActivity")}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        );

      case "preferences":
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-foreground mb-4">App Preferences</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
                <select 
                  value={settings.preferences.theme}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, theme: e.target.value }
                  }))}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Language</label>
                <select 
                  value={settings.preferences.language}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, language: e.target.value }
                  }))}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Currency</label>
                <select 
                  value={settings.preferences.currency}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    preferences: { ...prev.preferences, currency: e.target.value }
                  }))}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                </select>
              </div>
            </div>

            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Save Preferences
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  // Show loading state while session is loading
  if (sessionLoading) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-full"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (redirect will happen via useEffect)
  if (!session) {
    return null;
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-lg">
      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex space-x-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
}
