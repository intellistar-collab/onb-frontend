"use client";

import { useState } from "react";

export default function AccountWallet() {
  const [walletSettings, setWalletSettings] = useState({
    autoWithdraw: false,
    lowBalanceAlert: true,
    currency: "USD",
    paymentMethod: "card",
  });

  const handleSettingChange = (key: string, value: any) => {
    setWalletSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-foreground mb-4">Wallet Settings</h4>
      
      {/* Wallet Balance */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Balance</span>
          <span className="text-2xl font-bold text-foreground">$1,250.00</span>
        </div>
      </div>

      {/* Wallet Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <h5 className="font-medium text-foreground">Auto Withdraw</h5>
            <p className="text-sm text-muted-foreground">Automatically withdraw winnings to your bank account</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={walletSettings.autoWithdraw}
              onChange={(e) => handleSettingChange("autoWithdraw", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
          <div>
            <h5 className="font-medium text-foreground">Low Balance Alert</h5>
            <p className="text-sm text-muted-foreground">Get notified when your balance is low</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              checked={walletSettings.lowBalanceAlert}
              onChange={(e) => handleSettingChange("lowBalanceAlert", e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Default Payment Method</label>
        <select 
          value={walletSettings.paymentMethod}
          onChange={(e) => handleSettingChange("paymentMethod", e.target.value)}
          className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank">Bank Transfer</option>
          <option value="crypto">Cryptocurrency</option>
        </select>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
          Add Funds
        </button>
        <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
          Withdraw
        </button>
      </div>
    </div>
  );
}
