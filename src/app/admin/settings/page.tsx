"use client";

import { AdminRoute } from "@/components/auth/auth-guard";
import { AdminPageHeader, AdminCard } from "@/components/admin";
import { Button } from "@/components/ui/button";
import { Save, Users, Bell, Shield, Database } from "lucide-react";
import { useState } from "react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    allowUserRegistration: true,
    requireEmailVerification: false,
    maxBoxesPerUser: 5,
    defaultUserRole: "USER",
    maintenanceMode: false,
    emailNotifications: true,
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
  };

  return (
    <AdminRoute>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <AdminPageHeader
            title="System Settings"
            description="Configure platform settings and preferences"
            showBackButton
            backUrl="/admin/dashboard"
            actions={
              <Button onClick={handleSave} className="bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 transform transition-all duration-200 shadow-sm hover:shadow-md">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            }
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Management Settings */}
            <AdminCard
              className="lg:col-span-2"
              header={{
                title: "User Management",
                description: "Configure user registration and management settings",
                icon: <Users className="h-5 w-5" />,
              }}
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="admin-text-primary font-medium">Allow User Registration</h4>
                    <p className="admin-text-tertiary text-sm">Allow new users to register accounts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.allowUserRegistration}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          allowUserRegistration: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="admin-text-primary font-medium">Require Email Verification</h4>
                    <p className="admin-text-tertiary text-sm">
                      Users must verify their email before accessing the platform
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.requireEmailVerification}
                      onChange={(e) =>
                        setSettings((prev) => ({
                          ...prev,
                          requireEmailVerification: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div>
                  <label className="admin-text-primary block text-sm font-medium mb-2">
                    Max Boxes Per User
                  </label>
                  <input
                    type="number"
                    value={settings.maxBoxesPerUser}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        maxBoxesPerUser: parseInt(e.target.value),
                      }))
                    }
                    className="admin-input"
                    min="1"
                    max="100"
                  />
                </div>

                <div>
                  <label className="admin-text-primary block text-sm font-medium mb-2">
                    Default User Role
                  </label>
                  <select
                    value={settings.defaultUserRole}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        defaultUserRole: e.target.value,
                      }))
                    }
                    className="admin-input"
                  >
                    <option value="USER">User</option>
                    <option value="MODERATOR">Moderator</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
            </AdminCard>

            {/* System Settings */}
            <div className="space-y-6">
              <AdminCard
                header={{
                  title: "System",
                  icon: <Shield className="h-5 w-5" />,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="admin-text-primary font-medium text-sm">Maintenance Mode</h4>
                      <p className="admin-text-tertiary text-xs">Temporarily disable the platform</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            maintenanceMode: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </AdminCard>

              <AdminCard
                header={{
                  title: "Notifications",
                  icon: <Bell className="h-5 w-5" />,
                }}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="admin-text-primary font-medium text-sm">Email Notifications</h4>
                      <p className="admin-text-tertiary text-xs">Send email alerts to admins</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) =>
                          setSettings((prev) => ({
                            ...prev,
                            emailNotifications: e.target.checked,
                          }))
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </AdminCard>

              <AdminCard
                header={{
                  title: "Database",
                  icon: <Database className="h-5 w-5" />,
                }}
              >
                <div className="space-y-3">
                  <Button className="admin-button-secondary w-full justify-start">
                    Backup Database
                  </Button>
                  <Button className="admin-button-secondary w-full justify-start">
                    Clear Cache
                  </Button>
                  <Button className="admin-button-secondary w-full justify-start text-red-600 hover:text-red-700">
                    Reset Statistics
                  </Button>
                </div>
              </AdminCard>
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}