import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import id from './locales/id.json';

// Function to get the initial language from localStorage
const getInitialLanguage = () => {
  const storedLanguage = localStorage.getItem('i18nextLng');
  return storedLanguage || 'en'; // Default to English if no language is stored
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    lng: getInitialLanguage(), // Use the stored language or default
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

// Listen for language change events and store the new language in localStorage
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
