"use client";

import { useState } from "react";
import Image from "next/image";
import { securityAPI, ChangePasswordData } from "@/lib/api/account";
import { useToast } from "@/components/ui/toast";

export default function AccountSecurity() {
  const { toast } = useToast();
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [changingPassword, setChangingPassword] = useState(false);
  
  const [enabling2FA, setEnabling2FA] = useState(false);
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
      toast({
        title: "Validation Error",
        description: "New passwords do not match",
        variant: "destructive",
        durationMs: 4000,
      });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Validation Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
        durationMs: 4000,
      });
      return;
    }

    try {
      setChangingPassword(true);

      await securityAPI.changePassword(passwordData);
      
      toast({
        title: "Success!",
        description: "Password changed successfully!",
        variant: "success",
        durationMs: 3000,
      });
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to change password';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        durationMs: 5000,
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      setEnabling2FA(true);

      const result = await securityAPI.enable2FA();
      setQrCode(result.qrCode);
      setTwoFactorSecret(result.secret);
      
      toast({
        title: "2FA Setup",
        description: "QR code generated. Please scan with your authenticator app.",
        variant: "success",
        durationMs: 4000,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable 2FA';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        durationMs: 5000,
      });
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationToken) {
      toast({
        title: "Validation Error",
        description: "Please enter the verification code",
        variant: "destructive",
        durationMs: 4000,
      });
      return;
    }

    try {
      setEnabling2FA(true);

      await securityAPI.verify2FA(verificationToken);
      
      toast({
        title: "Success!",
        description: "2FA enabled successfully!",
        variant: "success",
        durationMs: 3000,
      });
      
      setQrCode(null);
      setTwoFactorSecret(null);
      setVerificationToken("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify 2FA';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        durationMs: 5000,
      });
    } finally {
      setEnabling2FA(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Change Section */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Password & Security</h4>

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
                <Image 
                  src={qrCode} 
                  alt="2FA QR Code" 
                  width={192} 
                  height={192}
                  className="w-48 h-48" 
                />
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
