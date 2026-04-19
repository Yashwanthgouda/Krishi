// Sun behind cloud with rain drops
export function WeatherIcon({ size = 28, color = '#4A90C4', strokeWidth = 1.8 }) {
  const sun = '#C8963A';
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Sun circle (peeking behind cloud) */}
      <circle cx="20" cy="9" r="4" stroke={sun} strokeWidth={strokeWidth} fill={sun} fillOpacity="0.15"/>
      {/* Sun rays */}
      <line x1="20" y1="3" x2="20" y2="1.5" stroke={sun} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="23.5" y1="5.5" x2="24.5" y2="4.5" stroke={sun} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="25" y1="9" x2="26.5" y2="9" stroke={sun} strokeWidth="1.4" strokeLinecap="round"/>
      {/* Cloud body */}
      <path d="M6 19 Q5 13 10 13 Q11 9 16 10 Q20 10 20 14 Q23 14 22 18 Q21 21 18 21 L8 21 Q5 21 6 19Z"
        stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.15" strokeLinejoin="round"/>
      {/* Rain drops */}
      <line x1="9"  y1="23" x2="8"  y2="26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="13" y1="23" x2="12" y2="26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="17" y1="23" x2="16" y2="26" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}
