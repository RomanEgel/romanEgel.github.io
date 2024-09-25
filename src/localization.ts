type Language = 'en' | 'ru';

export const translations = {
  en: {
    noRecordsFound: "No records found.",
    postedBy: "Posted by",
    filterByCategory: "Filter by category:",
    all: "All",
    search: "Search...",
    sortResults: "Sort results:",
    relevance: "Relevance",
    dateOldest: "Date (Oldest)",
    uponRequest: "Upon request",
    free: "Free",
  },
  ru: {
    noRecordsFound: "Записей не найдено.",
    postedBy: "Автор",
    filterByCategory: "Фильтр по категории:",
    all: "Все",
    search: "Поиск...",
    sortResults: "Сортировка результатов:",
    relevance: "Релевантность",
    dateOldest: "Дата (Старые)",
    uponRequest: "По запросу",
    free: "Бесплатно",
  },
};

export function getTranslation(key: keyof typeof translations.en, language: Language): string {
  return translations[language][key] || translations.en[key];
}