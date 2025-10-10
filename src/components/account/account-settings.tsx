"use client";

import { useState } from "react";

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile");
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Display Name</label>
              <input 
                type="text" 
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <input 
                type="email" 
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                defaultValue="john.doe@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea 
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent h-24 resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
            <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
              Save Changes
            </button>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-foreground mb-4">Password & Security</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            <div className="border-t border-border pt-6">
              <h5 className="font-medium text-foreground mb-3">Two-Factor Authentication</h5>
              <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
              <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
                Enable 2FA
              </button>
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
