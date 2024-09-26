import WebApp from '@twa-dev/sdk';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { User, Store, HeartHandshake, Calendar, MapPin, Filter, SortAsc, Search, Newspaper } from 'lucide-react'
import { fetchItems, fetchServices, fetchEvents, fetchNews } from './apiService'
import { useAuth } from './AuthContext'
import { getTranslation, translations } from './localization';

interface LocalsItem {
  id: number
  title: string
  price: number
  currency: string
  image: string
  author: string
  username: string
  publishedAt: string
  category: string
  description: string
  communityId: number
  messageId: number
}

interface LocalsService {
  id: number
  title: string
  price: number
  currency: string
  image: string
  author: string
  username: string
  publishedAt: string
  category: string
  description: string
  communityId: number
  messageId: number
}

interface LocalsEvent {
  id: number
  title: string
  date: string
  image: string
  author: string
  username: string
  publishedAt: string
  category: string
  description: string
  communityId: number
  messageId: number
}

interface LocalsNews {
  id: number
  title: string
  image: string
  author: string
  username: string
  publishedAt: string
  category: string
  description: string
  communityId: number
  messageId: number
}

type TabType = 'community' | 'items' | 'services' | 'news'
type SortType = 'relevance' | 'dateAsc'
type ListItem = LocalsItem | LocalsService | LocalsEvent | LocalsNews;

interface LocalsCommunity {
  id: number;
  name: string;
  description: string;
  membersCount: number;
  language: 'en' | 'ru';  // Add this line
}

interface AppProps {
  community: LocalsCommunity;
}

function App({ community }: AppProps) {
  const { authorization } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('community')
  const [sortBy, setSortBy] = useState<SortType>('relevance')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [items, setItems] = useState<LocalsItem[]>([])
  const [services, setServices] = useState<LocalsService[]>([])
  const [events, setEvents] = useState<LocalsEvent[]>([])
  const [news, setNews] = useState<LocalsNews[]>([])

  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)
  const sortDropdownRef = useRef<HTMLDivElement>(null)

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    if (
      filterButtonRef.current?.contains(event.target as Node) ||
      sortButtonRef.current?.contains(event.target as Node)
    ) {
      return;
    }

    if (
      !filterDropdownRef.current?.contains(event.target as Node) &&
      !sortDropdownRef.current?.contains(event.target as Node)
    ) {
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  const toggleDropdown = (dropdown: 'filter' | 'sort') => {
    setActiveDropdown(prevDropdown => prevDropdown === dropdown ? null : dropdown);
  };

  const getCategoryDisplayName = (category: string) => {
    return category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  const fetchData = async () => {
    try {
      const [itemsResponse, servicesResponse, eventsResponse, newsResponse] = await Promise.all([
        fetchItems(authorization),
        fetchServices(authorization),
        fetchEvents(authorization),
        fetchNews(authorization)
      ]);

      setItems(itemsResponse['items']);
      setServices(servicesResponse['services']);
      setEvents(eventsResponse['events']);
      setNews(newsResponse['news']);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getUniqueCategories = (items: ListItem[]) => {
    const categories = new Set<string>();
    items.forEach(item => {
      categories.add(item.category);
    });
    return Array.from(categories);
  };

  const getCategories = () => {
    let result: ListItem[] = 
      activeTab === 'community' ? events : 
      activeTab === 'items' ? items : 
      activeTab === 'services' ? services :
      news;

    const uniqueCategories = getUniqueCategories(result);
    return ['all', ...uniqueCategories];
  };

  const categories = useMemo(() => getCategories(), [activeTab, items, services, events, news]);

  const filteredAndSortedItems = useMemo(() => {
    let result: ListItem[] = 
      activeTab === 'community' ? events : 
      activeTab === 'items' ? items : 
      activeTab === 'services' ? services :
      news

    if (activeCategory === 'my events' || activeCategory === 'my items' || activeCategory === 'my services') {
      result = result.filter(item => item.id % 2 === 0)
    } else if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory)
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim()
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.author.toLowerCase().includes(query)
      )
    }

    return result.sort((a, b) => {
      if (sortBy === 'dateAsc') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      }
      return 0
    })
  }, [activeTab, activeCategory, sortBy, searchQuery, items, services, events, news])

  useEffect(() => {
    setActiveCategory('all')
  }, [activeTab])


  const openTelegramLink = (url: string) => {
    WebApp.openLink(url);
  };

  const formatDate = (dateString: string, isEventDate: boolean = false) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...(isEventDate ? { timeZone: 'UTC' } : {})
    };
    
    const locale = community.language === 'ru' ? 'ru-RU' : 'en-US';
    return new Intl.DateTimeFormat(locale, options).format(new Date(dateString));
  };

  const t = (key: keyof typeof translations.en) => getTranslation(key, community.language);

  const formatPrice = (price: number | null | undefined, currency: string | null | undefined) => {
    if (price === null || price === undefined) {
      return t('uponRequest');
    }
    if (price === 0) {
      return t('free');
    }
    if (currency === null || currency === undefined) {
      return `${price}`;  // Return just the price if currency is not available
    }
    if (currency === 'USD') {
      return `$${price.toFixed(2)}`;
    } else if (currency === 'RUB') {
      return `${Math.round(price)} ₽`;
    }
    return `${price} ${currency}`;  // Fallback for any other currency
  };

  const renderTabContent = () => {
    if (filteredAndSortedItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center app-hint">{t('noRecordsFound')}</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col space-y-4 mb-16 w-full">
        {filteredAndSortedItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => openTelegramLink(`https://t.me/c/${item.communityId.toString().slice(4)}/${item.messageId}`)}
            className="rounded-lg shadow overflow-hidden flex items-center cursor-pointer app-card"
          >
            <div className="w-24 h-24 flex-shrink-0 relative app-image-container">
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-grow min-w-0">
              <h3 className="font-semibold truncate text-base mb-1 app-text">{item.title}</h3>
              {'price' in item && 'currency' in item && (
                <p className="font-bold app-price text-sm">
                  {formatPrice(item.price, item.currency)}
                </p>
              )}
              {'date' in item && (
                <p className="font-bold app-event-date text-sm">
                  {formatDate(item.date, true)}
                </p>
              )}
              <p className="text-sm mt-1 line-clamp-2 app-subtitle">{item.description}</p>
              <div className="text-xs mt-2 flex flex-wrap justify-between items-center app-subtitle">
                <p className="truncate mr-2 app-author-text">
                  {t('postedBy')} <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      openTelegramLink(`https://t.me/${item.username}`);
                    }}
                    className="app-author hover:underline cursor-pointer"
                  >
                    {item.author}
                  </span>
                </p>
                <p className="whitespace-nowrap app-publication-date">
                  {formatDate(item.publishedAt)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col app-body">
      <div className="flex-grow flex flex-col app-container">
        <header className="app-header">
          <div className="flex justify-between items-center text-center">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 app-link" />
              <span className="text-sm app-text">{community.name}</span>
            </div>
            <div className="flex items-center">
              <button className="p-1 rounded-full app-button">
                <User className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        <div className="app-filter-row">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button 
                ref={filterButtonRef}
                className="p-2 rounded-lg flex items-center justify-center app-button"
                onClick={() => toggleDropdown('filter')}
              >
                <Filter className="h-5 w-5" />
                {activeCategory !== 'all' && (
                  <span className="ml-2 text-sm truncate max-w-[100px] app-text">
                    {getCategoryDisplayName(activeCategory)}
                  </span>
                )}
              </button>
              {activeDropdown === 'filter' && (
                <div 
                  ref={filterDropdownRef} 
                  className="absolute left-0 top-full mt-1 w-56 rounded-md shadow-lg app-dropdown focus:outline-none z-50"
                >
                  <div className="py-1">
                    <p className="px-4 py-2 text-sm app-hint">{t('filterByCategory')}</p>
                    {categories.map((category) => (
                      <a
                        key={category}
                        href="#"
                        className={`block px-4 py-2 text-sm app-dropdown-item ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => {
                          setActiveCategory(category)
                          setActiveDropdown(null)
                        }}
                      >
                        {category === 'all' ? t('all') : getCategoryDisplayName(category)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex-grow relative">
              <input
                type="text"
                placeholder={t('search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 app-input"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 app-search-icon" />
            </div>
            <div className="relative">
              <button 
                ref={sortButtonRef}
                className="p-2 rounded-lg flex items-center app-button"
                onClick={() => toggleDropdown('sort')}
              >
                <SortAsc className="h-5 w-5" />
              </button>
              {activeDropdown === 'sort' && (
                <div 
                  ref={sortDropdownRef} 
                  className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg app-dropdown focus:outline-none z-50"
                >
                  <div className="py-1">
                    <p className="px-4 py-2 text-sm app-hint">{t('sortResults')}</p>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm app-dropdown-item ${sortBy === 'relevance' ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy('relevance')
                        setActiveDropdown(null)
                      }}
                    >
                      {t('relevance')}
                    </a>
                    <a
                      href="#"
                      className={`block px-4 py-2 text-sm app-dropdown-item ${sortBy === 'dateAsc' ? 'active' : ''}`}
                      onClick={() => {
                        setSortBy('dateAsc')
                        setActiveDropdown(null)
                      }}
                    >
                      {t('dateOldest')}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="flex-grow overflow-y-auto app-main-content">
          <div className="container mx-auto p-4">
            {renderTabContent()}
          </div>
        </main>

        <nav className="app-nav">
          <div className="flex justify-around">
            {['community', 'items', 'services', 'news'].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 app-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab as TabType)}
              >
                {tab === 'community' && <Calendar className="h-6 w-6 mx-auto" />}
                {tab === 'items' && <Store className="h-6 w-6 mx-auto" />}
                {tab === 'services' && <HeartHandshake className="h-6 w-6 mx-auto" />}
                {tab === 'news' && <Newspaper className="h-6 w-6 mx-auto" />}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  )
}

export default App