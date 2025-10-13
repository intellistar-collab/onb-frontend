"use client"

import React, { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface LoadingImageProps {
  src: string
  alt: string
  fill?: boolean
  sizes?: string
  className?: string
  placeholder?: string
  priority?: boolean
  preloaded?: boolean
}

const SmartImage: React.FC<LoadingImageProps> = ({
  src,
  alt,
  fill = false,
  sizes,
  className,
  placeholder = "/box/card-bg.png",
  priority = false,
  preloaded = false
}) => {
  const [hasError, setHasError] = useState(false)

  // Check if src is empty, null, or just a placeholder path
  const shouldUsePlaceholder = !src || src === placeholder || src === "/box/card-bg.png" || src.trim() === ""

  const handleError = () => {
    console.warn(`Image failed to load: ${src}`)
    setHasError(true)
  }

  // Reset error state when src changes
  React.useEffect(() => {
    setHasError(false)
  }, [src])

  // If we should use placeholder or there's an error, show placeholder only
  if (shouldUsePlaceholder || hasError) {
    return (
      <div className={cn("relative", fill && "w-full h-full")}>
        <Image
          src={placeholder}
          alt={alt}
          fill={fill}
          sizes={sizes}
          className={cn("object-cover", className)}
          priority={priority}
          suppressHydrationWarning
        />
      </div>
    )
  }

  // Show the actual image directly
  return (
    <div className={cn("relative", fill && "w-full h-full")}>
      <Image
        src={src}
        alt={alt}
        fill={fill}
        sizes={sizes}
        className={cn("object-cover", className)}
        onError={handleError}
        priority={priority}
        suppressHydrationWarning
        unoptimized={src.includes('imagedelivery.net')} // Disable optimization for problematic domain
        loading={priority || preloaded ? "eager" : "lazy"}
        quality={75}
      />
    </div>
  )
}

export default SmartImage
