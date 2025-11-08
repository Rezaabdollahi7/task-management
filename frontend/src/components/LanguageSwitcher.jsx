// src/components/LanguageSwitcher.jsx
// Language switcher component

import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Update document direction and language
  useEffect(() => {
    const dir = i18n.language === "fa" ? "rtl" : "ltr";
    const lang = i18n.language;

    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [i18n.language]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
  };

  const currentLang = i18n.language;

  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => changeLanguage("fa")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
          currentLang === "fa"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        فارسی
      </button>
      <button
        onClick={() => changeLanguage("en")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
          currentLang === "en"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        English
      </button>
    </div>
  );
};

export default LanguageSwitcher;
