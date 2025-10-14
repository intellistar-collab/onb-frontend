"use client";

import { useState } from "react";
import { securityAPI, ChangePasswordData } from "@/lib/api/account";

export default function AccountSecurity() {
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [twoFactorError, setTwoFactorError] = useState<string | null>(null);
  const [twoFactorSuccess, setTwoFactorSuccess] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [twoFactorSecret, setTwoFactorSecret] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState("");

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters long");
      return;
    }

    try {
      setChangingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      await securityAPI.changePassword(passwordData);
      setPasswordSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setEnabling2FA(true);
      setTwoFactorError(null);
      setTwoFactorSuccess(null);

      const result = await securityAPI.enable2FA();
      setQrCode(result.qrCode);
      setTwoFactorSecret(result.secret);
    } catch (err) {
      setTwoFactorError(err instanceof Error ? err.message : 'Failed to enable 2FA');
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationToken) {
      setTwoFactorError("Please enter the verification code");
      return;
    }

    try {
      setEnabling2FA(true);
      setTwoFactorError(null);

      await securityAPI.verify2FA(verificationToken);
      setTwoFactorSuccess('2FA enabled successfully!');
      setQrCode(null);
      setTwoFactorSecret(null);
      setVerificationToken("");
    } catch (err) {
      setTwoFactorError(err instanceof Error ? err.message : 'Failed to verify 2FA');
    } finally {
      setEnabling2FA(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Password & Security</h4>
        
        {passwordError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{passwordError}</p>
          </div>
        )}
        
        {passwordSuccess && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
            <p className="text-green-600 dark:text-green-400 text-sm">{passwordSuccess}</p>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <input 
              type="password" 
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <input 
              type="password" 
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
              minLength={8}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          <button 
            type="submit"
            disabled={changingPassword}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {changingPassword ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication Section */}
      <div className="border-t border-border pt-6">
        <h5 className="font-medium text-foreground mb-3">Two-Factor Authentication</h5>
        <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
        
        {twoFactorError && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p className="text-red-600 dark:text-red-400 text-sm">{twoFactorError}</p>
          </div>
        )}
        
        {twoFactorSuccess && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
            <p className="text-green-600 dark:text-green-400 text-sm">{twoFactorSuccess}</p>
          </div>
        )}

        {!qrCode ? (
          <button 
            onClick={handleEnable2FA}
            disabled={enabling2FA}
            className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {enabling2FA ? 'Setting up...' : 'Enable 2FA'}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Scan this QR code with your authenticator app:</p>
              <div className="inline-block p-4 bg-white rounded-lg">
                <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Or enter this secret manually: {twoFactorSecret}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Verification Code</label>
              <input 
                type="text" 
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter 6-digit code from your app"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={handleVerify2FA}
                disabled={enabling2FA || !verificationToken}
                className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {enabling2FA ? 'Verifying...' : 'Verify & Enable'}
              </button>
              <button 
                onClick={() => {
                  setQrCode(null);
                  setTwoFactorSecret(null);
                  setVerificationToken("");
                }}
                className="bg-muted text-muted-foreground px-6 py-2 rounded-lg font-medium hover:bg-muted/90 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
