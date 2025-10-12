"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  className?: string;
}

const predefinedColors = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6b7280", // gray-500
  "#1f2937", // gray-800
  "#dc2626", // red-600
  "#ea580c", // orange-600
  "#ca8a04", // yellow-600
  "#16a34a", // green-600
  "#0891b2", // cyan-600
  "#2563eb", // blue-600
  "#7c3aed", // violet-600
  "#db2777", // pink-600
  "#374151", // gray-700
  "#111827", // gray-900
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value = "#3b82f6",
  onChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const pickerRef = useRef<HTMLDivElement>(null);

  // Check if current hex input is valid
  const isValidHex = /^#[0-9A-Fa-f]{3}$|^#[0-9A-Fa-f]{6}$/.test(hexInput);

  // Update hex input when value changes
  useEffect(() => {
    setHexInput(value);
  }, [value]);

  // Close picker when clicking outside and adjust position
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const adjustPosition = () => {
      if (pickerRef.current && isOpen) {
        const rect = pickerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 300; // Approximate height of dropdown
        
        if (rect.bottom + dropdownHeight > viewportHeight) {
          setDropdownPosition('top');
        } else {
          setDropdownPosition('bottom');
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      adjustPosition();
      window.addEventListener('resize', adjustPosition);
      window.addEventListener('scroll', adjustPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', adjustPosition);
      window.removeEventListener('scroll', adjustPosition);
    };
  }, [isOpen]);

  const handleHexInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setHexInput(input);
    
    // Apply color if it's a valid hex format (3 or 6 digits)
    if (/^#[0-9A-Fa-f]{3}$/.test(input)) {
      // Convert 3-digit hex to 6-digit
      const expanded = `#${input[1]}${input[1]}${input[2]}${input[2]}${input[3]}${input[3]}`;
      onChange(expanded);
    } else if (/^#[0-9A-Fa-f]{6}$/.test(input)) {
      onChange(input);
    }
  };

  const handleHexInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValidHex) {
      setIsOpen(false);
    }
  };

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    onChange(color);
    setHexInput(color);
  };

  return (
    <div className={cn("relative", className)} ref={pickerRef}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start gap-2"
      >
        <div
          className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
          style={{ backgroundColor: value }}
        />
        <span className="text-slate-700 dark:text-slate-300">
          {value.toUpperCase()}
        </span>
      </Button>

      {isOpen && (
        <div className={`absolute z-20 w-full max-w-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-lg p-3 ${
          dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}>
          <div className="grid grid-cols-5 gap-2">
            {predefinedColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onChange(color);
                  setHexInput(color);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-8 h-8 rounded border-2 transition-all hover:scale-110",
                  value === color
                    ? "border-slate-900 dark:border-slate-100"
                    : "border-slate-300 dark:border-slate-600 hover:border-slate-500"
                )}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
          
          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 space-y-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Hex Color
              </label>
              <div className="relative">
                <Input
                  type="text"
                  value={hexInput}
                  onChange={handleHexInputChange}
                  onKeyDown={handleHexInputKeyDown}
                  placeholder="#000000"
                  className={`bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white text-sm font-mono pr-8 ${
                    hexInput && !isValidHex ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  maxLength={7}
                />
                {hexInput && (
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <div
                      className="w-4 h-4 rounded border border-slate-300 dark:border-slate-600"
                      style={{ backgroundColor: isValidHex ? (hexInput.length === 4 ? `#${hexInput[1]}${hexInput[1]}${hexInput[2]}${hexInput[2]}${hexInput[3]}${hexInput[3]}` : hexInput) : '#ef4444' }}
                    />
                  </div>
                )}
              </div>
              {hexInput && !isValidHex && (
                <p className="text-xs text-red-500 mt-1">Invalid hex color format</p>
              )}
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Color Picker
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={value}
                  onChange={handleColorInputChange}
                  className="w-12 h-8 rounded border border-slate-300 dark:border-slate-600 cursor-pointer"
                  title="Click to open color picker"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Click to open full color picker
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
