"use client";

import React from "react";

interface QRCodeProps {
  address: string;
  size?: number;
}

const QRCode: React.FC<QRCodeProps> = ({ address, size = 192 }) => {
  // In a real implementation, you would use a QR code library like 'qrcode' or 'react-qr-code'
  // For now, we'll create a placeholder that looks like a QR code
  
  const generateQRPattern = () => {
    const pattern = [];
    for (let i = 0; i < 25; i++) {
      const row = [];
      for (let j = 0; j < 25; j++) {
        // Create a pseudo-random pattern that looks like a QR code
        const shouldFill = (i + j) % 3 === 0 || (i * j) % 7 === 0 || i === 0 || j === 0 || i === 24 || j === 24;
        row.push(shouldFill ? 'black' : 'white');
      }
      pattern.push(row);
    }
    return pattern;
  };

  const qrPattern = generateQRPattern();

  return (
    <div className="bg-white rounded-lg p-4 w-fit mx-auto">
      <div 
        className="grid grid-cols-25 gap-0"
        style={{ 
          width: size, 
          height: size,
          gridTemplateColumns: 'repeat(25, 1fr)'
        }}
      >
        {qrPattern.map((row, i) =>
          row.map((color, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-1 h-1 ${color === 'black' ? 'bg-black' : 'bg-white'}`}
              style={{ width: `${size / 25}px`, height: `${size / 25}px` }}
            />
          ))
        )}
      </div>
      <div className="text-center mt-2 text-xs text-gray-600">
        Scan to deposit
      </div>
    </div>
  );
};

export default QRCode;
