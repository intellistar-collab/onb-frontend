"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, CheckCircle, Building2, CreditCard } from 'lucide-react';

interface BankTransferProps {
  amount: number;
  currency: string;
  onSuccess: () => void;
}

const BankTransfer: React.FC<BankTransferProps> = ({
  amount,
  currency,
  onSuccess,
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const bankDetails = {
    accountName: "Casino Gaming Ltd",
    accountNumber: "1234567890",
    routingNumber: "021000021",
    swiftCode: "CHASUS33",
    bankName: "Chase Bank",
    bankAddress: "383 Madison Ave, New York, NY 10017",
  };

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(field);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="space-y-4">
      {/* Payment Summary */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-2">Bank Transfer Details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Amount:</span>
            <span className="text-white font-medium">${amount} {currency.toUpperCase()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Payment Method:</span>
            <span className="text-white">Bank Transfer</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Processing Time:</span>
            <span className="text-white">1-3 business days</span>
          </div>
        </div>
      </div>

      {/* Bank Details */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h4 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Bank Information
        </h4>
        
        <div className="space-y-3">
          {/* Account Name */}
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-xs text-gray-400">Account Name</div>
              <div className="text-white font-medium">{bankDetails.accountName}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bankDetails.accountName, 'accountName')}
              className="text-gray-400 hover:text-white"
            >
              {copied === 'accountName' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Account Number */}
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-xs text-gray-400">Account Number</div>
              <div className="text-white font-medium">{bankDetails.accountNumber}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bankDetails.accountNumber, 'accountNumber')}
              className="text-gray-400 hover:text-white"
            >
              {copied === 'accountNumber' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* Routing Number */}
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-xs text-gray-400">Routing Number</div>
              <div className="text-white font-medium">{bankDetails.routingNumber}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bankDetails.routingNumber, 'routingNumber')}
              className="text-gray-400 hover:text-white"
            >
              {copied === 'routingNumber' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>

          {/* SWIFT Code */}
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
            <div>
              <div className="text-xs text-gray-400">SWIFT Code</div>
              <div className="text-white font-medium">{bankDetails.swiftCode}</div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(bankDetails.swiftCode, 'swiftCode')}
              className="text-gray-400 hover:text-white"
            >
              {copied === 'swiftCode' ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Bank Address */}
      <div className="p-4 bg-gray-800 rounded-lg">
        <h4 className="text-md font-semibold text-white mb-2">Bank Address</h4>
        <div className="text-gray-300 text-sm">
          <div className="font-medium">{bankDetails.bankName}</div>
          <div>{bankDetails.bankAddress}</div>
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg">
        <h4 className="text-md font-semibold text-blue-300 mb-2">Instructions</h4>
        <div className="text-blue-200 text-sm space-y-1">
          <div>1. Use the bank details above for your transfer</div>
          <div>2. Include your user ID in the reference/note field</div>
          <div>3. Transfer exactly ${amount} {currency.toUpperCase()}</div>
          <div>4. Funds will be credited within 1-3 business days</div>
        </div>
      </div>

      {/* Reference Number */}
      <div className="p-3 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
        <div className="text-yellow-300 text-sm">
          <strong>Important:</strong> Include this reference in your transfer: <span className="font-mono">CASINO-{Date.now().toString().slice(-6)}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <Button
        onClick={onSuccess}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium"
      >
        <CreditCard className="w-5 h-5 mr-2" />
        I Will Transfer ${amount} {currency.toUpperCase()}
      </Button>

      {/* Security Notice */}
      <div className="text-xs text-gray-400 text-center">
        🔒 Bank transfers are processed securely
      </div>
    </div>
  );
};

export default BankTransfer;
