import React from "react";

interface RoundedShapeProps {
  children: React.ReactNode;
  clipPath: string;
  className?: string;
  radius?: number;
}

const RoundedShape = ({
  children,
  clipPath,
  className = "",
  radius = 5,
}: RoundedShapeProps) => {
  const filterId = `rounded-shape-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <>
      {/* SVG Filter for rounded corners */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={radius}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Container with filter applied */}
      <div
        className={className}
        style={{
          filter: `url(#${filterId})`,
        }}
      >
        {/* Shape element */}
        <div
          style={{
            clipPath: clipPath,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default RoundedShape;
