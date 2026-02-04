import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function DarkModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative rounded-full hover:bg-primary/10 transition-colors"
    >
      <motion.div
        initial={false}
        animate={{ 
          rotate: theme === 'dark' ? 180 : 0,
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 0.3,
          rotate: { type: "spring", stiffness: 300, damping: 20 }
        }}
      >
        {theme === 'dark' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5 text-yellow-400" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5 text-indigo-400" />
          </motion.div>
        )}
      </motion.div>
      
      {/* Animated background effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-primary/20"
        initial={false}
        animate={{
          scale: theme === 'dark' ? [1, 1.5, 1] : [1, 1.3, 1],
          opacity: theme === 'dark' ? [0, 0.3, 0] : [0, 0.2, 0]
        }}
        transition={{ duration: 0.4 }}
      />
    </Button>
  );
}