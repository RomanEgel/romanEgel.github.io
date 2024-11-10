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
    viewInChat: "Open in Chat",
    contactAuthor: "Contact Author",
    price: 'Price',
    currency: 'Currency',
    delete: 'Delete',
    deleteConfirmation: 'Are you sure you want to delete this item?',
    interestedInItemMessage: "Hello, I'm interested in your item: ",
    interestedInServiceMessage: "Hello, I'm interested in your service: ",
    interestedInEventMessage: "Hello, I'm interested in the event: ",
    interestedInNewsMessage: "Hello, I'm writing to you about the news: ",
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    title: 'Title',
    date: 'Date',
    description: 'Description',
    communitySetup: 'Community Setup',
    selectLanguage: 'Select Language',
    enterLocation: 'Enter Location',
    pickLocation: 'Pick Location',
    enterDescription: 'Enter Description',
    english: 'English',
    russian: 'Russian',
    location: 'Location',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    confirm: 'Confirm',
    selectedLocation: "Selected location",
    clickMapToSelectLocation: "Click on the map to select a location",
    ongoingSetup: "is being setup. Please check later.",
    entityExtractionSettings: 'Hashtag Settings',
    eventHashtag: 'Event Hashtag',
    itemHashtag: 'Item Hashtag',
    serviceHashtag: 'Service Hashtag',
    newsHashtag: 'News Hashtag',
    event: 'event',
    item: 'item',
    service: 'service',
    news: 'news',
    createNewEntityInstructionPart1: 'To create a new {{entityType}}, send a message with the following hashtag:',
    createNewEntityInstructionPart2: 'in the community chat.',
    noEventsFound: 'No events found',
    noItemsFound: 'No items found',
    noServicesFound: 'No services found',
    noNewsFound: 'No news found',
    loading: 'Loading...',
    add: 'Add',
    category: 'Category',
    uploadImage: 'Upload Image',
    selectCommunity: "Select the Community",
    noCommunitiesAvailable: 'No Communities Available',
    uncategorized: 'Other',
    failedToFindEntity: 'Not Found',
    createAdvertisement: 'Create Advertisement',
    selectAdvertiseType: 'Select Type',
    whatWouldYouLikeToAdvertise: 'What would you like to advertise?',
    selectLocation: 'Select Location',
    locationDescription: 'We need your location to show your advertisement to nearby users',
    service_advertisement_description: 'I am offering a service and want to advertise it',
    item_advertisement_description: 'I have an item to sell and want to advertise it',
    selectRange: 'Select Range',
    selectAdvertisementRange: 'Select Advertisement Range',
    rangeDescription: 'Communities within {{range}} km will see your advertisement',
    enterDetails: 'Enter Details',
    itemTitle: 'Item Title',
    itemDescription: 'Item Description',
    itemPrice: 'Item Price',
    serviceTitle: 'Service Title',
    serviceDescription: 'Service Description',
    servicePrice: 'Service Price',
    invalidPrice: 'Please enter a valid price',
    priceMustBeGreaterThanZero: 'Price must be greater than zero',
    priceExceedsLimit: 'Price cannot exceed {{max}} {{currency}}',
    titleTooLong: 'Title cannot exceed {{max}} characters',
    descriptionTooLong: 'Description cannot exceed {{max}} characters',
    uploadImages: 'Upload Images',
    maxImagesError: 'You can only upload up to {{max}} images',
    uploadImageAlt: 'Upload {{num}}',
    deleteImage: 'Delete image',
    addImage: 'Add Image',
    invalidImageFormat: 'Please select valid image files only',
    imageLoadError: 'Failed to load image',
    localsOnlyCommunity: 'Locals Only Community',
    locationTooFarFromCommunities: 'Selected location is too far from any community. Please select a location within {{range}}km of a community.',
    noCommunitiesInRange: 'No communities found within selected range. Please increase the range to include at least one community.',
    advertisementCreated: 'Advertisement successfully created',
    advertisementCreationFailed: 'Failed to create advertisement',
    creating: 'Creating...',
    yourAdvertisements: 'Your Advertisements',
    noAdvertisementsYet: 'You have no advertisements yet',
    advertisementDetails: 'Advertisement Details',
    confirmDeleteAdvertisement: 'Are you sure you want to delete this advertisement?',
    primary: 'Primary',
    dragToReorder: 'Drag to reorder',
    sponsored: "Sponsored",
    interestedInAd: "Hello! I'm interested in your advertisement: {{title}}",
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
    viewInChat: "Открыть в чате",
    contactAuthor: "Связаться с автором",
    price: 'Цена',
    currency: 'Валюта',
    delete: 'Удалить',
    deleteConfirmation: 'Вы уверены, что хотите удалить этот элемент?',
    interestedInItemMessage: 'Здравствуйте, пишу на счет вашего объявления: ',
    interestedInServiceMessage: 'Здравствуйте, меня интересует услуга: ',
    interestedInEventMessage: 'Здравствуйте, пишу на счет события: ',
    interestedInNewsMessage: 'Здравствуйте, пишу на счет новости: ',
    cancel: 'Отменить',
    save: 'Сохранить',
    edit: 'Редактировать',
    title: 'Название',
    date: 'Дата',
    description: 'Описание',
    communitySetup: 'Настройка сообщества',
    selectLanguage: 'Выберите язык',
    enterLocation: 'Введите местоположение',
    pickLocation: 'Выбрать местоположение',
    enterDescription: 'Введите описание',
    english: 'Английский',
    russian: 'Русский',
    location: 'Местоположение',
    back: 'Назад',
    next: 'Далее',
    finish: 'Завершить',
    confirm: 'Подтвердить',
    selectedLocation: "Выбранное местоположение",
    clickMapToSelectLocation: "Нажмите на карту, чтобы выбрать местоположение",
    ongoingSetup: "настраивается. Пожалуйста, попробуйте зайти позже.",
    entityExtractionSettings: 'Настройка хэштегов',
    eventHashtag: 'Хештег события',
    itemHashtag: 'Хештег товара',
    serviceHashtag: 'Хештег услуги',
    newsHashtag: 'Хештег новости',
    event: 'мероприятие',
    item: 'товар',
    service: 'услугу',
    news: 'новость',
    createNewEntityInstructionPart1: 'Чтобы добавить {{entityType}}, отправьте сообщение c хэштегом:',
    createNewEntityInstructionPart2: 'в чат сообщества.',
    noEventsFound: 'Нет опубликованных событий',
    noItemsFound: 'Нет опубликованных товаров',
    noServicesFound: 'Нет опубликованных услуг',
    noNewsFound: 'Нет опубликованных новостей',
    loading: 'Загрузка...',
    add: 'Добавить',
    category: 'Категория',
    uploadImage: 'Загрузить изображение',
    selectCommunity: 'Выберете Сообщество',
    noCommunitiesAvailable: 'Нет Доступных Сообществ',
    uncategorized: 'Другое',
    failedToFindEntity: 'Не найдено',
    createAdvertisement: 'Создать объявление',
    selectAdvertiseType: 'Выберите тип',
    whatWouldYouLikeToAdvertise: 'Что вы хотите рекламировать?',
    selectLocation: 'Выберите местоположение',
    locationDescription: 'Нам нужно ваше местоположение, чтобы показывать ваше объявление пользователям поблизости',
    service_advertisement_description: 'Я предоставляю услугу и хочу прорекламировать её',
    item_advertisement_description: 'Я продаю товар и хочу прорекламировать его',
    selectRange: 'Выберите радиус',
    selectAdvertisementRange: 'Выберите радиус действия объявления',
    rangeDescription: 'Сообщества в радиусе {{range}} км увидят ваше объявление',
    enterDetails: 'Введите детали',
    itemTitle: 'Название товара',
    itemDescription: 'Описание товара',
    itemPrice: 'Цена товара',
    serviceTitle: 'Название услуги',
    serviceDescription: 'Описание услуги',
    servicePrice: 'Цена услуги',
    invalidPrice: 'Пожалуйста, введите корректную цену',
    priceMustBeGreaterThanZero: 'Цена должна быть больше нуля',
    priceExceedsLimit: 'Цена не может превышать {{max}} {{currency}}',
    titleTooLong: 'Название не может превышать {{max}} символов',
    descriptionTooLong: 'Описание не может превышать {{max}} символов',
    uploadImages: 'Загрузить изображения',
    maxImagesError: 'Вы можете загрузить не более {{max}} изображений',
    uploadImageAlt: 'Загрузка {{num}}',
    deleteImage: 'Удалить изображение',
    addImage: 'Добавить изображение',
    invalidImageFormat: 'Пожалуйста, выберите только файлы изображений',
    imageLoadError: 'Не удалось загрузить изображение',
    localsOnlyCommunity: 'Сообщество Locals Only',
    locationTooFarFromCommunities: 'Выбранное местоположение находится слишком далеко от сообществ. Пожалуйста, выберите местоположение в пределах {{range}} км от сообщества.',
    noCommunitiesInRange: 'В выбранном радиусе не найдено сообществ. Пожалуйста, увеличьте радиус, чтобы покрыть хотя бы одно сообщество.',
    advertisementCreated: 'Объявление успешно создано',
    advertisementCreationFailed: 'Не удалось создать объявление',
    creating: 'Создание...',
    yourAdvertisements: 'Ваши объявления',
    noAdvertisementsYet: 'У Вас пока нет объявлений',
    advertisementDetails: 'Детали объявления',
    confirmDeleteAdvertisement: 'Вы уверены, что хотите удалить это объявление?',
    primary: 'Основное',
    dragToReorder: 'Перетащите, чтобы изменить порядок',
    sponsored: "Реклама",
    interestedInAd: "Здравствуйте! Меня заинтересовало ваше объявление: {{title}}",
  },
} as const;

export function getTranslation(key: keyof typeof translations.en, language: Language): string {
  return translations[language][key] || translations.en[key];
}