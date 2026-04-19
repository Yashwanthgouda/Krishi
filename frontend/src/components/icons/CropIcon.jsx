// Sprouting seedling — stem, two leaves, root system
export function CropIcon({ size = 28, color = '#3D7A3F', strokeWidth = 1.8 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden="true">
      {/* Main stem */}
      <path d="M14 24 L14 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Left leaf */}
      <path d="M14 18 C10 16 6 12 9 7 C11 9 13 13 14 18Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity="0.15"/>
      {/* Right leaf */}
      <path d="M14 14 C18 12 22 8 19 4 C17 6 15 10 14 14Z" stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round" fill={color} fillOpacity="0.15"/>
      {/* Root – center */}
      <path d="M14 24 L14 27" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Root – left */}
      <path d="M14 25 Q11 26 9 28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
      {/* Root – right */}
      <path d="M14 25 Q17 26 19 28" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>
    </svg>
  );
}
