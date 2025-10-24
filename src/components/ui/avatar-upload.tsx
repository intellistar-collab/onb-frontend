"use client";

import React, { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AvatarUploadProps {
  value: string;
  onChange: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  className?: string;
  disabled?: boolean;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({
  value,
  onChange,
  onFileChange,
  className = "",
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  // Handle file selection
  const handleFile = useCallback((file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);
    
    // Convert to base64 for storage
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      onChange(base64);
      onFileChange?.(file);
    };
    reader.readAsDataURL(file);
  }, [onChange, onFileChange]);

  // Handle drag and drop
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [disabled, handleFile]);

  // Handle file input change
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  // Handle click to open file dialog
  const handleClick = useCallback(() => {
    if (disabled) return;
    fileInputRef.current?.click();
  }, [disabled]);

  // Handle remove image
  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onFileChange?.(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange, onFileChange]);

  // Handle URL input
  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    onChange(url);
    setPreview(url);
  }, [onChange]);

  // Determine what to show
  const showPreview = preview || value;
  const isBase64 = value.startsWith('data:image/');

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`
          relative w-32 h-32 mx-auto rounded-full border-2 border-dashed transition-colors
          ${dragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-blue-400'}
          flex items-center justify-center overflow-hidden
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {showPreview ? (
          <div className="relative w-full h-full">
            <Image
              src={isBase64 ? value : showPreview}
              alt="Avatar preview"
              fill
              className="object-cover rounded-full"
              onError={() => setPreview(null)}
            />
            {!disabled && (
              <button
                type="button"
                onClick={handleRemove}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {dragActive ? 'Drop image here' : 'Click or drag'}
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Or enter image URL
        </label>
        <input
          type="url"
          value={isBase64 ? '' : value}
          onChange={handleUrlChange}
          placeholder="https://example.com/avatar.jpg"
          className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
        />
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {showPreview ? 'Change Image' : 'Upload Image'}
      </Button>

      {/* File Info */}
      {isBase64 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Image uploaded as base64
        </div>
      )}
    </div>
  );
};
