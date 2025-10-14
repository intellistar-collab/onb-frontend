"use client";

import { useState } from "react";

export default function AccountPreferences() {
  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    currency: "USD",
  });

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-foreground mb-4">App Preferences</h4>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Theme</label>
          <select 
            value={preferences.theme}
            onChange={(e) => handlePreferenceChange("theme", e.target.value)}
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
            value={preferences.language}
            onChange={(e) => handlePreferenceChange("language", e.target.value)}
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
            value={preferences.currency}
            onChange={(e) => handlePreferenceChange("currency", e.target.value)}
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
}
