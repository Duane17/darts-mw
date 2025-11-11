// src/components/common/DiagonalAccent.tsx
import * as React from "react";

type DiagonalAccentProps = React.HTMLAttributes<HTMLDivElement>;

export function DiagonalAccent({ className = "", ...rest }: DiagonalAccentProps) {
  return (
    // Wrapper receives className from the caller and anchors the two accents
    <div
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
      {...rest}
    >
      {/* Top-left red diagonal */}
      <div
        className="absolute left-0 top-0 h-20 w-20 md:h-32 md:w-32"
        style={{
          background: "linear-gradient(45deg, #e10600 0%, transparent 70%)",
          clipPath: "polygon(0 0, 100% 0, 0 100%)",
        }}
      />
      {/* Bottom-right green diagonal */}
      <div
        className="absolute bottom-0 right-0 h-20 w-20 md:h-32 md:w-32"
        style={{
          background: "linear-gradient(225deg, #0a7a44 0%, transparent 70%)",
          clipPath: "polygon(100% 0, 100% 100%, 0 100%)",
        }}
      />
    </div>
  );
}
