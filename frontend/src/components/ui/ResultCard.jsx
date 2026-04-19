import { motion, AnimatePresence } from 'framer-motion';

export function ResultCard({ title, children, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="border-2 border-leaf bg-cream rounded-2xl overflow-hidden shadow-lift mt-6"
        >
          <div className="bg-leaf-pale px-6 py-4 border-b border-leaf/20">
            <h2 className="text-xl font-extrabold text-leaf">{title}</h2>
          </div>
          <div className="p-6 bg-white">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
