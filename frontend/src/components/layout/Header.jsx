import { useTranslation } from 'react-i18next';
import { CropIcon } from '../icons/CropIcon';

export function Header() {
  const { t, i18n } = useTranslation();

  const cycleLang = () => {
    const langs = ['en', 'hi', 'kn', 'te'];
    const next = langs[(langs.indexOf(i18n.language) + 1) % langs.length];
    i18n.changeLanguage(next);
    localStorage.setItem('krishi_lang', next);
  };

  return (
    <header className="h-[var(--header-h)] bg-white shadow-sm flex items-center justify-between px-4 lg:hidden sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-leaf flex items-center justify-center">
          <CropIcon size={20} color="#fff" />
        </div>
        <h1 className="text-xl font-extrabold text-soil">{t('app.name')}</h1>
      </div>
      
      <button 
        onClick={cycleLang}
        className="px-3 py-1.5 rounded-full bg-leaf-pale text-leaf font-bold text-sm border border-transparent active:scale-95 transition-transform"
      >
        {t(`lang.${i18n.language}`)}
      </button>
    </header>
  );
}
