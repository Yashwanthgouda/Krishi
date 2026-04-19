import { motion } from 'framer-motion';

export function LoadingLeaf({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 relative">
         <motion.div 
           className="w-full h-full bg-leaf rounded-tl-full rounded-br-full opacity-20 absolute"
           animate={{ rotate: 360 }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
         />
         <motion.div 
           className="w-full h-full bg-leaf rounded-tl-full rounded-br-full absolute scale-75"
           animate={{ rotate: -360 }}
           transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
         />
      </div>
      <p className="mt-4 text-soil font-bold text-lg animate-pulse">{text}</p>
    </div>
  );
}
