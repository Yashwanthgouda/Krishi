import { motion } from 'framer-motion';

export function FeatureCard({ Icon, title, subtitle, colorClass = 'bg-leaf-pale text-leaf', onClick, delay = 0 }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="card text-left flex flex-col w-full hover:-translate-y-1 hover:shadow-lift transition-all duration-200 border border-transparent hover:border-leaf/20 h-full"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${colorClass}`}>
        <Icon size={28} color="currentColor" />
      </div>
      <h3 className="text-[17px] font-bold text-soil leading-tight">{title}</h3>
      <p className="text-[13px] text-soil-light mt-1 flex-1">{subtitle}</p>
    </motion.button>
  );
}
