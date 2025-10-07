import React from 'react';
import { cn } from '@/lib/utils';

interface DarkBackgroundProps {
    children: React.ReactNode;
    className?: string;
}

const DarkBackground = ({ children, className }: DarkBackgroundProps) => {
  return (
    <div className={cn("relative", className)}>
        <div className="absolute top-0 left-0 -translate-x-1/6 -translate-y-1/6 h-96 w-96 bg-black/60 rounded-full blur-3xl -z-10"/>
        {children}
    </div>
  )
}

export default DarkBackground