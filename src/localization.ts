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
    'my items': 'My Items',
    'my services': 'My Services',
    'my events': 'My Events',
    viewInChat: "View in Chat",
    contactAuthor: "Contact Author",
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
    'my items': 'Мои товары',
    'my services': 'Мои услуги',
    'my events': 'Мои события',
    viewInChat: "Посмотреть в чате",
    contactAuthor: "Связаться с автором",
  },
};

export function getTranslation(key: keyof typeof translations.en, language: Language): string {
  return translations[language][key] || translations.en[key];
}