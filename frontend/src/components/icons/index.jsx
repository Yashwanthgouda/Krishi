// Home / farmhouse icon
export function HomeIcon({ size = 24, color = 'currentColor', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3 10.5 L12 3 L21 10.5 V21 H15 V15 H9 V21 H3 Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity="0.12"/>
    </svg>
  );
}

// Menu / bars icon
export function MenuIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="3" y1="6"  x2="21" y2="6"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="3" y1="12" x2="21" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="3" y1="18" x2="21" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

// Close / X icon
export function CloseIcon({ size = 24, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="4" y1="4" x2="20" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="20" y1="4" x2="4" y2="20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

// Arrow right
export function ArrowRightIcon({ size = 20, color = 'currentColor', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10 H16 M11 5 L16 10 L11 15" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Check / tick
export function CheckIcon({ size = 20, color = 'currentColor', strokeWidth = 2.5 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M4 10 L8 14 L16 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Trending up arrow
export function TrendUpIcon({ size = 20, color = '#3D7A3F', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 14 L8 9 L12 12 L17 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 6 H17 V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Trending down
export function TrendDownIcon({ size = 20, color = '#C0392B', strokeWidth = 2 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 6 L8 11 L12 8 L17 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M13 14 H17 V10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// Water drop
export function WaterIcon({ size = 20, color = '#4A90C4', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3 Q14 8 14 12 A4 4 0 0 1 6 12 Q6 8 10 3Z"
        stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity="0.18"/>
    </svg>
  );
}

// Sun icon
export function SunIcon({ size = 20, color = '#C8963A', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="3.5" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.2"/>
      <line x1="10" y1="2"  x2="10" y2="4"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="10" y1="16" x2="10" y2="18" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="2"  y1="10" x2="4"  y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="16" y1="10" x2="18" y2="10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="4.6"  y1="4.6"  x2="5.9"  y2="5.9"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="14.1" y1="14.1" x2="15.4" y2="15.4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="14.1" y1="5.9"  x2="15.4" y2="4.6"  stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="4.6"  y1="15.4" x2="5.9"  y2="14.1" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

// Wind icon
export function WindIcon({ size = 20, color = '#4A90C4', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 8 Q8 8 10 6 Q12 4 14 6 Q16 8 14 10 Q12 12 10 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <path d="M2 12 Q10 12 13 14 Q15 16 13 18 Q11 19 10 17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

// Alert / warning triangle
export function AlertIcon({ size = 20, color = '#C8963A', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M10 3 L18 17 H2 Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity="0.15"/>
      <line x1="10" y1="9" x2="10" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <circle cx="10" cy="15.5" r="0.8" fill={color}/>
    </svg>
  );
}

// Calendar
export function CalendarIcon({ size = 20, color = '#3D7A3F', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4" width="16" height="14" rx="2" stroke={color} strokeWidth={strokeWidth} fill={color} fillOpacity="0.1"/>
      <line x1="2"  y1="8"  x2="18" y2="8" stroke={color} strokeWidth={strokeWidth}/>
      <line x1="6"  y1="2"  x2="6"  y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      <line x1="14" y1="2"  x2="14" y2="6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}

export * from './CropIcon';
export * from './FertilizerIcon';
export * from './WeatherIcon';
export * from './DiseaseIcon';
export * from './PriceIcon';
export * from './MicIcon';