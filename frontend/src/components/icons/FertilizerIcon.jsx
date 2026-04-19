// Fertilizer bag with tie at top and N-P-K marks
export function FertilizerIcon({ size = 28, color = '#C8963A', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Bag body */}
      <rect x="5" y="10" width="18" height="15" rx="3" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.12"/>
      {/* Bag neck / tie */}
      <path d="M10 10 Q14 7 18 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Tie knot */}
      <circle cx="14" cy="6" r="2" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.2"/>
      {/* N marker */}
      <text x="7.5" y="20" fontSize="5" fontWeight="bold" fill={color} fontFamily="sans-serif">N</text>
      {/* P marker */}
      <text x="12.5" y="20" fontSize="5" fontWeight="bold" fill={color} fontFamily="sans-serif">P</text>
      {/* K marker */}
      <text x="17.5" y="20" fontSize="5" fontWeight="bold" fill={color} fontFamily="sans-serif">K</text>
      {/* Divider line */}
      <line x1="5" y1="22" x2="23" y2="22" stroke={color} strokeWidth="0.8" opacity="0.4"/>
    </svg>
  );
}
