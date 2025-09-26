import React from 'react';

interface ShadowContainerProps {
  children: React.ReactNode;
}

const ShadowContainer = ({ children }: ShadowContainerProps) => {
  return (
    <div className="">
      {children}
    </div>
  )
}

export default ShadowContainer