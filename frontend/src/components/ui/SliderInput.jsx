import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export function SliderInput({ label, min, max, value, onChange, unit = '', breaks }) {
  const { t } = useTranslation();
  
  // Calculate percentage for gradient background
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Determine badge level based on breaks
  let level = 'medium';
  let badgeClass = 'badge-gold';
  let badgeLabel = t('crop.medium');
  
  if (value < breaks[0]) {
    level = 'low';
    badgeClass = 'badge-green';
    badgeLabel = t('crop.low');
  } else if (value > breaks[1]) {
    level = 'high';
    badgeClass = 'badge-red';
    badgeLabel = t('crop.high');
  }

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex justify-between items-end mb-3 mt-1">
        <label className="text-[15px] font-bold text-soil">{label}</label>
        <div className="flex items-center gap-2">
           <span className="text-xs font-semibold text-soil-light">{value} {unit}</span>
           <span className={badgeClass}>{badgeLabel}</span>
        </div>
      </div>
      
      <div className="relative pt-2 pb-2">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="krishi-slider"
          style={{ '--val': `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-[11px] font-semibold text-gray-400 px-1 mt-1">
         <span>{min}</span>
         <span>{max}</span>
      </div>
    </div>
  );
}
