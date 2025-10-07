"use client";

import { useState } from "react";

export default function AccountWallet() {
  const [walletData] = useState({
    balance: 1250,
    pendingDeposits: 50,
    totalDeposited: 5000,
    totalWithdrawn: 1200,
    transactions: [
      {
        id: 1,
        type: "deposit",
        amount: 100,
        date: "2024-01-15",
        status: "completed",
        method: "Credit Card",
        description: "Deposit via Visa ****1234"
      },
      {
        id: 2,
        type: "purchase",
        amount: -25,
        date: "2024-01-14",
        status: "completed",
        method: "Wallet",
        description: "Premium Mystery Box"
      },
      {
        id: 3,
        type: "withdrawal",
        amount: -200,
        date: "2024-01-13",
        status: "pending",
        method: "Bank Transfer",
        description: "Withdrawal to Bank Account"
      },
      {
        id: 4,
        type: "reward",
        amount: 50,
        date: "2024-01-12",
        status: "completed",
        method: "Bonus",
        description: "Daily login bonus"
      },
      {
        id: 5,
        type: "purchase",
        amount: -75,
        date: "2024-01-11",
        status: "completed",
        method: "Wallet",
        description: "Elite Experience Box"
      }
    ]
  });

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit": return "💰";
      case "purchase": return "📦";
      case "withdrawal": return "💸";
      case "reward": return "🎁";
      default: return "💳";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500";
      case "pending": return "text-yellow-500";
      case "failed": return "text-red-500";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Wallet Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary mb-1">{walletData.balance}</div>
            <div className="text-sm text-muted-foreground">Available Balance</div>
            <div className="text-xs text-green-500 mt-1">💰 Tokens</div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{walletData.pendingDeposits}</div>
            <div className="text-sm text-muted-foreground">Pending Deposits</div>
            <div className="text-xs text-yellow-500 mt-1">⏳ Processing</div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600 mb-1">{walletData.totalDeposited}</div>
            <div className="text-sm text-muted-foreground">Total Deposited</div>
            <div className="text-xs text-green-500 mt-1">📈 All Time</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600 mb-1">{walletData.totalWithdrawn}</div>
            <div className="text-sm text-muted-foreground">Total Withdrawn</div>
            <div className="text-xs text-blue-500 mt-1">💸 All Time</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3">
          <button className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
            💳 Deposit Tokens
          </button>
          <button className="bg-secondary text-secondary-foreground px-6 py-2 rounded-lg font-medium hover:bg-secondary/90 transition-colors">
            💸 Withdraw Funds
          </button>
          <button className="bg-muted text-muted-foreground px-6 py-2 rounded-lg font-medium hover:bg-muted/80 transition-colors">
            📊 View Reports
          </button>
        </div>
      </div>

      {/* Deposit & Withdraw Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Deposit */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-foreground mb-4">💰 Deposit Tokens</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-2 text-muted-foreground">Tokens</span>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Payment Method</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">Cryptocurrency</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>
            
            <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors">
              Deposit Now
            </button>
          </div>
        </div>

        {/* Withdraw */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
          <h4 className="text-lg font-semibold text-foreground mb-4">💸 Withdraw Funds</h4>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={walletData.balance}
                  className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="absolute right-3 top-2 text-muted-foreground">USD</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Max: {walletData.balance} tokens available
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Withdrawal Method</label>
              <select className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="bank">Bank Transfer</option>
                <option value="paypal">PayPal</option>
                <option value="crypto">Cryptocurrency</option>
              </select>
            </div>
            
            <button className="w-full bg-secondary text-secondary-foreground py-2 rounded-md hover:bg-secondary/90 transition-colors">
              Request Withdrawal
            </button>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card rounded-lg border border-border p-6 shadow-lg">
        <h4 className="text-lg font-semibold text-foreground mb-4">📊 Transaction History</h4>
        
        <div className="space-y-3">
          {walletData.transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="text-2xl">{getTransactionIcon(transaction.type)}</div>
                <div>
                  <div className="font-medium text-foreground">{transaction.description}</div>
                  <div className="text-sm text-muted-foreground">
                    {transaction.date} • {transaction.method}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${transaction.amount > 0 ? 'text-green-500' : 'text-foreground'}`}>
                  {transaction.amount > 0 ? '+' : ''}{transaction.amount} 
                  {transaction.type === 'withdrawal' ? ' USD' : ' tokens'}
                </div>
                <div className={`text-sm ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <button className="text-primary hover:text-primary/80 transition-colors text-sm">
            View All Transactions →
          </button>
        </div>
      </div>
    </div>
  );
}
