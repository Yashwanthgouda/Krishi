// Microphone with sound waves
export function MicIcon({ size = 28, color = '#fff', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Mic capsule */}
      <rect x="10" y="3" width="8" height="13" rx="4" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.2"/>
      {/* Mic stand arc */}
      <path d="M7 16 Q7 22 14 22 Q21 22 21 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"/>
      {/* Stand pole */}
      <line x1="14" y1="22" x2="14" y2="26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Base */}
      <line x1="10" y1="26" x2="18" y2="26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Sound waves */}
      <path d="M4 12 Q2.5 14 4 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M1.5 10 Q-0.5 14 1.5 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" opacity="0.4"/>
      <path d="M24 12 Q25.5 14 24 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M26.5 10 Q28.5 14 26.5 18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none" opacity="0.4"/>
    </svg>
  );
}
