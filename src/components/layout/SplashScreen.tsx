import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

// Splash screen exibida apenas uma vez por sessão do navegador.
// Tela preta, nome da loja surge com fade + zoom sutil + brilho prateado, depois some.
export function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence onExitComplete={onFinish}>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        >
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            <motion.span
              initial={{ letterSpacing: '0.05em' }}
              animate={{ letterSpacing: '0.12em' }}
              transition={{ duration: 1.4, ease: 'easeOut' }}
              className="text-shimmer animate-shimmer bg-silver-shimmer font-display text-4xl italic sm:text-5xl"
            >
              A Predileta
            </motion.span>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="font-display text-lg tracking-[0.35em] text-silver-300"
            >
              MODAS
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
