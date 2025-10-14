"use client";

import { useState, useEffect } from "react";
import { walletAPI, WalletData, WalletTransaction } from "@/lib/api/account";

export default function AccountWallet() {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  
  // Form states
  const [addFundsAmount, setAddFundsAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showAddFunds, setShowAddFunds] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const [wallet, transactionsData] = await Promise.all([
          walletAPI.getWallet(),
          walletAPI.getTransactions(1, 10)
        ]);
        setWalletData(wallet);
        setTransactions(transactionsData.transactions);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load wallet data');
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleSettingChange = async (key: string, value: any) => {
    if (!walletData) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      const updatedWallet = await walletAPI.updateWalletSettings({
        [key]: value
      });
      setWalletData(updatedWallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update wallet settings');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addFundsAmount || parseFloat(addFundsAmount) <= 0) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      await walletAPI.addFunds(parseFloat(addFundsAmount), paymentMethod);
      
      setSuccess('Funds added successfully!');
      setAddFundsAmount("");
      setShowAddFunds(false);
      
      // Refresh wallet data
      const wallet = await walletAPI.getWallet();
      setWalletData(wallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add funds');
    } finally {
      setUpdating(false);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) return;
    
    try {
      setUpdating(true);
      setError(null);
      
      await walletAPI.withdraw(parseFloat(withdrawAmount), paymentMethod);
      
      setSuccess('Withdrawal request submitted successfully!');
      setWithdrawAmount("");
      setShowWithdraw(false);
      
      // Refresh wallet data
      const wallet = await walletAPI.getWallet();
      setWalletData(wallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Failed to load wallet data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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

      {/* Wallet Balance */}
      <div className="p-4 bg-muted/50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Current Balance</span>
          <span className="text-2xl font-bold text-foreground">${walletData.balance.toFixed(2)}</span>
        </div>
        {walletData.pendingDeposits > 0 && (
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">Pending Deposits</span>
            <span className="text-sm text-yellow-600">${walletData.pendingDeposits.toFixed(2)}</span>
          </div>
        )}
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
              checked={walletData.autoWithdraw}
              onChange={(e) => handleSettingChange("autoWithdraw", e.target.checked)}
              disabled={updating}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50"></div>
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
              checked={walletData.lowBalanceAlert}
              onChange={(e) => handleSettingChange("lowBalanceAlert", e.target.checked)}
              disabled={updating}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary disabled:opacity-50"></div>
          </label>
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Default Payment Method</label>
        <select 
          value={walletData.paymentMethod}
          onChange={(e) => handleSettingChange("paymentMethod", e.target.value)}
          disabled={updating}
          className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
        >
          <option value="card">Credit/Debit Card</option>
          <option value="paypal">PayPal</option>
          <option value="bank">Bank Transfer</option>
          <option value="crypto">Cryptocurrency</option>
        </select>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowAddFunds(true)}
          disabled={updating}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          Add Funds
        </button>
        <button 
          onClick={() => setShowWithdraw(true)}
          disabled={updating || walletData.balance <= 0}
          className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50"
        >
          Withdraw
        </button>
      </div>

      {/* Add Funds Modal */}
      {showAddFunds && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Add Funds</h3>
            <form onSubmit={handleAddFunds} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                <input 
                  type="number" 
                  value={addFundsAmount}
                  onChange={(e) => setAddFundsAmount(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter amount"
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowAddFunds(false)}
                  className="flex-1 bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/90 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updating || !addFundsAmount || parseFloat(addFundsAmount) <= 0}
                  className="flex-1 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Processing...' : 'Add Funds'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdraw && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg border border-border p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Withdraw Funds</h3>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
                <input 
                  type="number" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter amount"
                  min="1"
                  max={walletData.balance}
                  step="0.01"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Available: ${walletData.balance.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Withdrawal Method</label>
                <select 
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-3 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="card">Credit/Debit Card</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowWithdraw(false)}
                  className="flex-1 bg-muted text-muted-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted/90 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={updating || !withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > walletData.balance}
                  className="flex-1 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Processing...' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h4>
        <div className="space-y-2">
          {transactions.length === 0 ? (
            <p className="text-muted-foreground text-sm">No transactions yet</p>
          ) : (
            transactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 bg-background rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.createdAt).toLocaleDateString()} • {transaction.method}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.amount > 0 ? '+' : ''}${transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}