import { cn } from "@/lib/utils";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
}

export function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  squares,
  strokeDasharray = "0",
  className,
}: GridPatternProps) {
  const patternId = `pattern-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <svg
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y], i) => (
            <rect
              strokeWidth="0"
              key={`${i}-${x}-${y}`}
              x={x * width}
              y={y * height}
              width={width - 1}
              height={height - 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
