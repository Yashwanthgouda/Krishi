// Bar chart with rupee symbol
export function PriceIcon({ size = 28, color = '#3D7A3F', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Base line */}
      <line x1="3" y1="24" x2="25" y2="24" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Bar 1 – short */}
      <rect x="4"  y="18" width="5" height="6" rx="1.5" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.2"/>
      {/* Bar 2 – tall */}
      <rect x="11" y="11" width="5" height="13" rx="1.5" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.35"/>
      {/* Bar 3 – medium */}
      <rect x="18" y="15" width="5" height="9" rx="1.5" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.2"/>
      {/* Rupee symbol on tallest bar */}
      <text x="12.6" y="8.5" fontSize="5.5" fontWeight="bold" fill={color} fontFamily="sans-serif">₹</text>
    </svg>
  );
}
