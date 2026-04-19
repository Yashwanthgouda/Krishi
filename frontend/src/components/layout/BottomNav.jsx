import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '../icons';
import { CropIcon } from '../icons/CropIcon';
import { WeatherIcon } from '../icons/WeatherIcon';
import { PriceIcon } from '../icons/PriceIcon';
import { MenuIcon } from '../icons'; // For "More"

export function BottomNav() {
  const { t } = useTranslation();

  const navItems = [
    { to: '/',        label: t('nav.home'),    Icon: HomeIcon },
    { to: '/crop',    label: t('nav.crop'),    Icon: CropIcon },
    { to: '/weather', label: t('nav.weather'), Icon: WeatherIcon },
    { to: '/prices',  label: t('nav.prices'),  Icon: PriceIcon },
    // "More" could open a bottom sheet, but for now we link to fertilizer as a placeholder for navigation limits on mobile
    { to: '/fertilizer', label: t('nav.fertilizer'), Icon: MenuIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-[var(--bottomnav-h)] bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.05)] md:hidden flex justify-around items-center px-2 z-40 pb-safe">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
              isActive ? 'text-leaf' : 'text-soil-light'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <item.Icon size={24} color={isActive ? '#3D7A3F' : '#6B4C3B'} />
              <span className={`text-[11px] font-semibold ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
