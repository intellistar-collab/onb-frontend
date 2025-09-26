import React from "react";

// export default function RoundedClipShapeDemo() {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
//       {/* SVG filter lives once at the root of the page */}
//       <svg width="0" height="0" className="absolute">
//         <defs>
//           {/* tweak stdDeviation for more/less rounding */}
//           <filter id="roundCorners">
//             <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
//             <feColorMatrix
//               in="blur"
//               mode="matrix"
//               values={`
//                 1 0 0 0 0
//                 0 1 0 0 0
//                 0 0 1 0 0
//                 0 0 0 20 -10
//               `}
//               result="goo"
//             />
//             <feComposite in="SourceGraphic" in2="goo" operator="atop" />
//           </filter>
//         </defs>
//       </svg>

//       {/* Demo grid */}
//       <div className="grid gap-8 md:grid-cols-2 max-w-5xl w-full">
//         <ShapeCard title="Trapezium (rounded)" subtitle="clip-path: polygon(...)" bg="bg-teal-500">
//           <RoundedClipShape
//             blur={6}
//             polygon="0% 0%, 100% 0%, 85% 100%, 0% 100%"
//             className="w-full aspect-[4/3]"
//           />
//         </ShapeCard>

//         <ShapeCard title="Hexagon (rounded)" subtitle="Six-sided polygon" bg="bg-indigo-500">
//           <RoundedClipShape
//             blur={7}
//             polygon="25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%"
//             className="w-full aspect-[1/1]"
//           />
//         </ShapeCard>

//         <ShapeCard title="Ribbon notch" subtitle="Banner with notch" bg="bg-rose-500">
//           <RoundedClipShape
//             blur={5}
//             polygon="0 0, 100% 0, 100% 70%, 75% 70%, 65% 100%, 55% 70%, 0 70%"
//             className="w-full aspect-[3/1]"
//           />
//         </ShapeCard>

//         <ShapeCard title="Custom content overlay" subtitle="Safe readable text on top" bg="bg-emerald-600">
//           <div className="relative w-full aspect-[16/9]">
//             <RoundedClipShape
//               blur={7}
//               polygon="0 10%, 100% 0, 90% 100%, 0% 90%"
//               className="absolute inset-0"
//             />
//             {/* Content overlay (not filtered) */}
//             <div className="absolute inset-0 grid place-items-center px-6">
//               <div className="text-white text-center drop-shadow-lg">
//                 <h2 className="text-2xl font-semibold">Readable Overlay</h2>
//                 <p className="opacity-90">This text sits above the filtered layer, so it stays crisp.</p>
//               </div>
//             </div>
//           </div>
//         </ShapeCard>
//       </div>
//     </div>
//   );
// }

/** Card wrapper used for the demo grid */
function ShapeCard({ title, subtitle, bg, children }: { title: string; subtitle?: string; bg?: string; children: React.ReactNode; }) {
  return (
    <div className="rounded-2xl shadow-sm border bg-white">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      </div>
      <div className={`p-4 ${bg ?? "bg-slate-200"} rounded-b-2xl`}>{children}</div>
    </div>
  );
}

/**
 * RoundedClipShape core component
 *
 * Props:
 *  - polygon: string of polygon points for clip-path
 *  - blur: number (stdDeviation for feGaussianBlur). Higher = more rounding
 *  - className: sizing via Tailwind (e.g., w-full aspect-[4/3])
 *
 * How it works:
 *  We render two layers:
 *   1) A wrapper that receives the SVG filter (roundCorners)
 *   2) An inner layer that applies clip-path with your polygon and a gradient bg
 */
function RoundedClipShape({ polygon, blur = 6, className = "", }: { polygon: string; blur?: number; className?: string; }) {
  // The filter is already defined globally (id="roundCorners").
  // We still keep blur as a prop in case you duplicate the filter with another id.
  return (
    <div
      className={`relative overflow-visible ${className}`}
      style={{ filter: "url(#roundCorners)" }}
    >
      <div
        className="absolute inset-0"
        style={{
          clipPath: `polygon(${polygon})`,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0))",
          WebkitClipPath: `polygon(${polygon})`,
        }}
      >
        {/* A base color panel behind the gradient to make the shape visible */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `polygon(${polygon})`,
            WebkitClipPath: `polygon(${polygon})`,
            background: "#0ea5e9", // Tailwind sky-500 color value; replace as needed
            mixBlendMode: "multiply",
          }}
        />
      </div>
    </div>
  );
}

export { RoundedClipShape, ShapeCard };