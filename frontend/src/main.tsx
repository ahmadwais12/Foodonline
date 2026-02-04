import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { LanguageProvider } from './contexts/LanguageContext.tsx'

// Set initial language direction based on localStorage or default to English
const savedLanguage = localStorage.getItem('language') || 'en';
document.documentElement.lang = savedLanguage;
document.documentElement.dir = savedLanguage === 'fa' || savedLanguage === 'ps' ? 'rtl' : 'ltr';

// Ensure the language is properly set in the LanguageProvider
localStorage.setItem('language', savedLanguage);

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="system" storageKey="fooddash-theme">
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </ThemeProvider>
);