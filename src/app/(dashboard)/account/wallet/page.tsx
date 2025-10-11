"use client";

import { AccountWallet, AccountLayout } from "@/components/account";
import { PaymentDialog, usePaymentDialog } from "@/components/payment";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
  const { isOpen, openDialog, closeDialog } = usePaymentDialog();

  return (
    <AccountLayout
      title="💰 Wallet"
      description="Manage your tokens, deposits, and withdrawals"
      icon="💰"
    >
      <div className="space-y-6">
        {/* Add Funds Button */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/30 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">💰</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Add Funds</h3>
              <p className="text-gray-300 text-sm">Deposit to your account</p>
            </div>
          </div>
          <p className="text-gray-300 text-sm mb-4">
            Deposit money to your account using crypto or fiat payments. 
            Choose from multiple payment methods including credit cards, PayPal, bank transfers, and cryptocurrencies.
          </p>
          <Button 
            onClick={openDialog}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
          >
            💰 Add Funds to Account
          </Button>
        </div>

        {/* Wallet Content */}
        <AccountWallet />
      </div>

      {/* Payment Dialog */}
      <PaymentDialog isOpen={isOpen} onClose={closeDialog} />
    </AccountLayout>
  );
}
