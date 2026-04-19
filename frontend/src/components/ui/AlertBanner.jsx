import { AlertIcon, CheckIcon } from '../icons';

export function AlertBanner({ type = 'warning', message }) {
  const isWarning = type === 'warning';
  const bgClass = isWarning ? 'bg-gold-pale border-gold/30' : 'bg-leaf-pale border-leaf/30';
  const textClass = isWarning ? 'text-gold' : 'text-leaf';
  const Icon = isWarning ? AlertIcon : CheckIcon;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border ${bgClass}`}>
      <div className={`mt-0.5 ${textClass}`}>
        <Icon size={20} />
      </div>
      <p className="text-[15px] font-semibold text-soil">{message}</p>
    </div>
  );
}
