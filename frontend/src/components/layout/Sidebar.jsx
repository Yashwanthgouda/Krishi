import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HomeIcon } from '../icons';
import { CropIcon } from '../icons/CropIcon';
import { FertilizerIcon } from '../icons/FertilizerIcon';
import { WeatherIcon } from '../icons/WeatherIcon';
import { DiseaseIcon } from '../icons/DiseaseIcon';
import { PriceIcon } from '../icons/PriceIcon';

export function Sidebar() {
  const { t, i18n } = useTranslation();

  const navItems = [
    { to: '/',            label: t('nav.home'),       Icon: HomeIcon },
    { to: '/crop',        label: t('nav.crop'),       Icon: CropIcon },
    { to: '/fertilizer',  label: t('nav.fertilizer'), Icon: FertilizerIcon },
    { to: '/weather',     label: t('nav.weather'),    Icon: WeatherIcon },
    { to: '/disease',     label: t('nav.disease'),    Icon: DiseaseIcon },
    { to: '/prices',      label: t('nav.prices'),     Icon: PriceIcon },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-[var(--sidebar-w)] bg-white shadow-card hidden lg:flex flex-col z-40">
      {/* Brand */}
      <div className="p-6 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-leaf flex items-center justify-center">
            <CropIcon size={24} color="#fff" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-soil leading-none">{t('app.name')}</h1>
            <p className="text-xs font-semibold text-soil-light mt-1 tracking-wide">{t('app.tagline')}</p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-4 max-y-auto overflow-y-auto space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3 rounded-lg font-semibold transition-colors duration-150 ${
                isActive
                  ? 'bg-leaf-pale text-leaf'
                  : 'text-soil-light hover:bg-gray-50 hover:text-soil'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.Icon size={24} color={isActive ? 'currentColor' : '#6B4C3B'} />
                <span className="text-[17px]">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Language Switcher */}
      <div className="p-4 border-t border-gray-100">
        <label className="text-xs font-bold text-soil-light uppercase tracking-wider block mb-2 px-2">Language</label>
        <div className="grid grid-cols-2 gap-2">
          {['en', 'hi', 'kn', 'te'].map(l => (
            <button
              key={l}
              onClick={() => {
                i18n.changeLanguage(l);
                localStorage.setItem('krishi_lang', l);
              }}
              className={`py-2 text-sm font-bold rounded-md transition-colors ${
                i18n.language === l
                  ? 'bg-soil text-white'
                  : 'bg-gray-100 text-soil-light hover:bg-gray-200'
              }`}
            >
              {t(`lang.${l}`)}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
