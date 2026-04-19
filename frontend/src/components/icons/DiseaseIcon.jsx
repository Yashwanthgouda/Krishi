// Leaf with magnifying glass overlaid
export function DiseaseIcon({ size = 28, color = '#C0392B', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Leaf shape */}
      <path d="M5 24 C5 24 4 12 14 6 C14 6 24 10 22 20 C20 24 14 26 8 24 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity="0.1"/>
      {/* Leaf mid-vein */}
      <path d="M8 23 C10 18 13 13 14 6" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      {/* Magnifying glass circle */}
      <circle cx="19" cy="19" r="5.5" stroke={color} strokeWidth={strokeWidth} fill="#fff" fillOpacity="0.85"/>
      {/* Magnifying glass handle */}
      <line x1="23" y1="23" x2="26" y2="26" stroke={color} strokeWidth={strokeWidth + 0.4} strokeLinecap="round"/>
      {/* Cross-hair inside lens */}
      <line x1="19" y1="16.5" x2="19" y2="21.5" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
      <line x1="16.5" y1="19" x2="21.5" y2="19" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}
