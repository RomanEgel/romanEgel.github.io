import WebApp from '@twa-dev/sdk';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Store, HeartHandshake, Calendar, MapPin, Filter, Search, Newspaper, UserCircle2, Loader2, /*Settings*/ } from 'lucide-react'
import { fetchItems, fetchServices, fetchEvents, fetchNews, deleteItem, deleteService, deleteEvent, deleteNews, updateItem, updateService, updateEvent, updateNews } from './apiService'
import { useAuth } from './AuthContext'
import { translations } from './localization';
import StorageManager from './StorageManager';
import CardDetailView from './CardDetailView';
import { formatDate, formatPrice, createTranslationFunction } from './utils';
import { LocalsCommunity, LocalsUser, LocalsItem, LocalsService, LocalsEvent, LocalsNews, ListItem } from './types';


type TabType = 'events' | 'items' | 'services' | 'news'

interface AppProps {
  community: LocalsCommunity;
  user: LocalsUser;
}

function App({ community, user }: AppProps) {
  const { authorization } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('events')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeDropdown, setActiveDropdown] = useState<'filter' | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

  const [items, setItems] = useState<LocalsItem[]>([])
  const [services, setServices] = useState<LocalsService[]>([])
  const [events, setEvents] = useState<LocalsEvent[]>([])
  const [news, setNews] = useState<LocalsNews[]>([])

  const filterButtonRef = useRef<HTMLButtonElement>(null)
  const filterDropdownRef = useRef<HTMLDivElement>(null)

  const handleDocumentClick = useCallback((event: MouseEvent) => {
    if (filterButtonRef.current?.contains(event.target as Node)) {
      return;
    }

    if (!filterDropdownRef.current?.contains(event.target as Node)) {
      setActiveDropdown(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('click', handleDocumentClick);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleDocumentClick]);

  const toggleDropdown = (dropdown: 'filter') => {
    setActiveDropdown(prevDropdown => prevDropdown === dropdown ? null : dropdown);
  };

  const getCategoryDisplayName = (category: string) => {
    if (category === 'all') {
      return t('all');
    }
    if (category.startsWith('my ')) {
      const type = category.split(' ')[1];
      return t(`my ${type}` as keyof typeof translations.en);
    }
    return category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Add this new state
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Modify the fetchData function
  const fetchData = async () => {
    setIsLoading(true)
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
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchData();
    
    // Retrieve the last active tab from StorageManager
    StorageManager.getItem('lastActiveTab').then((value) => {
      if (value) {
        setActiveTab(value as TabType);
      }
    });
  }, []);

  // Modify the updateActiveTab function
  const updateActiveTab = (tab: TabType) => {
    setActiveTab(tab);
    StorageManager.setItem('lastActiveTab', tab).catch((error) => {
      console.error('Error saving to storage:', error);
    });
    // Scroll to the top of the window when changing tabs
    window.scrollTo(0, 0);
  };

  const getUniqueCategories = (items: ListItem[]) => {
    const categories = new Set<string>();
    items.forEach(item => {
      categories.add(item.category);
    });
    return Array.from(categories);
  };

  const getCategories = () => {
    let result: ListItem[] = 
      activeTab === 'events' ? events : 
      activeTab === 'items' ? items : 
      activeTab === 'services' ? services :
      news;

    const uniqueCategories = getUniqueCategories(result);
    const categories = ['all', ...uniqueCategories];

    // Add "My items/services/events" category if user has any records
    const hasUserRecords = result.some(item => item.username === user.username);
    if (hasUserRecords) {
      categories.unshift(`my ${activeTab}`);
    }

    return categories;
  };

  const categories = useMemo(() => getCategories(), [activeTab, items, services, events, news, user.username]);

  const filteredItems = useMemo(() => {
    let result: ListItem[] = 
      activeTab === 'events' ? events : 
      activeTab === 'items' ? items : 
      activeTab === 'services' ? services :
      news

    if (activeCategory.startsWith('my ')) {
      result = result.filter(item => item.username === user.username)
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

    return result
  }, [activeTab, activeCategory, searchQuery, items, services, events, news, user.username])

  useEffect(() => {
    setActiveCategory('all')
  }, [activeTab])


  const openTelegramLink = (url: string) => {
    WebApp.openLink(url);
  };

  const t = createTranslationFunction(community.language);

  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);

  const handleItemClick = (item: ListItem) => {
    // Preserve the current state before opening the detailed view
    const currentState = {
      activeTab,
      activeCategory,
      searchQuery,
      scrollPosition: window.scrollY,
    };
    StorageManager.setItem('appState', JSON.stringify(currentState)).catch((error) => {
      console.error('Error saving state to storage:', error);
    });

    setSelectedItem(item);
  };

  const handleCloseDetailView = () => {
    setSelectedItem(null);

    // Restore the state when closing the detailed view
    StorageManager.getItem('appState').then((value) => {
      if (value) {
        const { activeTab, activeCategory, searchQuery, scrollPosition } = JSON.parse(value);
        setActiveTab(activeTab);
        setActiveCategory(activeCategory);
        setSearchQuery(searchQuery);
        window.scrollTo(0, scrollPosition);
      }
    }).catch((error) => {
      console.error('Error retrieving state from storage:', error);
    });
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <Loader2 className="h-8 w-8 animate-spin app-text" />
          <p className="mt-2 text-center app-hint">{t('loading')}</p>
        </div>
      );
    }

    if (filteredItems.length === 0) {
      const entitySettings = community.entitySettings;
      let hashtag: string;
      let localizedEntityType: string;
      let noRecordsFoundLocalized: string;
      switch (activeTab) {
        case 'events':
          hashtag = entitySettings.eventHashtag;
          localizedEntityType = t('event');
          noRecordsFoundLocalized = t('noEventsFound');
          break;
        case 'items':
          hashtag = entitySettings.itemHashtag;
          localizedEntityType = t('item');
          noRecordsFoundLocalized = t('noItemsFound');
          break;
        case 'services':
          hashtag = entitySettings.serviceHashtag;
          localizedEntityType = t('service');
          noRecordsFoundLocalized = t('noServicesFound');
          break;
        case 'news':
          hashtag = entitySettings.newsHashtag;
          localizedEntityType = t('news');
          noRecordsFoundLocalized = t('noNewsFound');
          break;
        default:
          throw new Error('Invalid tab');
      }

      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <p className="text-center app-hint mb-4">{noRecordsFoundLocalized}</p>
          <div className="app-card rounded-lg p-4 max-w-sm">
            <p className="text-center app-hint text-sm mb-2">
              {t('createNewEntityInstructionPart1').replace('{{entityType}}', localizedEntityType)}
            </p>
            <div className="app-button border rounded p-2 text-center">
              <span className="font-mono app-button-text font-semibold">{hashtag}</span>
            </div>
            <p className="text-center app-hint text-sm mt-2">
              {t('createNewEntityInstructionPart2')}
            </p>
          </div>
        </div>
      );
    }
    return (
      <div className="flex flex-col space-y-4 mb-16 w-full">
        {filteredItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleItemClick(item)}
            className="rounded-lg shadow overflow-hidden flex items-center cursor-pointer app-card relative"
          >
            <div className="w-24 h-24 flex-shrink-0 relative app-image-container">
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
              {item.username === user.username && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white p-1 rounded-full">
                  <UserCircle2 className="h-4 w-4" />
                </div>
              )}
            </div>
            <div className="p-4 flex-grow min-w-0">
              <h3 className="font-semibold truncate text-base mb-1 app-text">{item.title}</h3>
              {'price' in item && 'currency' in item && (
                <p className="font-bold app-price text-sm">
                  {formatPrice(item.price, item.currency, community.language)}
                </p>
              )}
              {'date' in item && (
                <p className="font-bold app-event-date text-sm">
                  {formatDate(item.date, true, community.language)}
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
                  {formatDate(item.publishedAt, false, community.language)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const [showNav, setShowNav] = useState(true);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const appContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const visualViewport = window.visualViewport;

    if (visualViewport) {
      const handleResize = () => {
        if (appContainerRef.current) {
          const containerHeight = appContainerRef.current.offsetHeight;
          const visibleHeight = visualViewport.height;
          const heightDifference = containerHeight - visibleHeight;

          if (isInputFocused && heightDifference > 100) {
            setShowNav(false);
          } else if (!isInputFocused || heightDifference < 100) {
            setShowNav(true);
          }
        }
      };

      visualViewport.addEventListener('resize', handleResize);

      return () => visualViewport.removeEventListener('resize', handleResize);
    }
  }, [isInputFocused]);

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
    // Add a small delay to ensure the keyboard has time to close
    setTimeout(() => {
      setShowNav(true);
    }, 100);
  };

  const [reloadData, setReloadData] = useState(false);

  useEffect(() => {
    if (reloadData) {
      fetchData();
      setReloadData(false);
    }
  }, [reloadData]);

  const handleEditItem = async (item: ListItem, active_tab: string) => {
    try {
      switch (active_tab) {
        case 'items':
          await updateItem(item as LocalsItem, authorization);
          break;
        case 'services':
          await updateService(item as LocalsService, authorization);
          break;
        case 'events':
          await updateEvent(item as LocalsEvent, authorization);
          break;
        case 'news':
          await updateNews(item as LocalsNews, authorization);
          break;
      }
      
      // Set the reload flag to true
      setReloadData(true);
      
      setSelectedItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
      setSelectedItem(null);
    }
  };

  const handleDeleteItem = async (item_id: string, active_tab: string) => {
    try {
      switch (active_tab) {
        case 'items':
          await deleteItem(item_id, authorization);
          break;
        case 'services':
          await deleteService(item_id, authorization);
          break;
        case 'events':
          await deleteEvent(item_id, authorization);
          break;
        case 'news':
          await deleteNews(item_id, authorization);
          break;
      }
      
      // Set the reload flag to true
      setReloadData(true);
      
      setSelectedItem(null);
    } catch (error) {
      console.error('Error deleting item:', error);
      setSelectedItem(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col app-body">
      {selectedItem ? (
        <CardDetailView
          item={selectedItem}
          community={community}
          active_tab={activeTab}
          onClose={handleCloseDetailView}
          communityLanguage={community.language}
          isCurrentUserAuthor={selectedItem.username === user.username}
          onDelete={handleDeleteItem}
          onEdit={handleEditItem}
        />
      ) : (
        <div ref={appContainerRef} className="flex-grow flex flex-col app-container">
          <header className="app-header">
            <div className="flex justify-between items-center text-center">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{community.name}</span>
              </div>
              {/* <div className="flex items-center">
                <button className="p-1 rounded-full app-button">
                  <Settings className="h-5 w-5" />
                </button>
              </div> */}
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
                    <span className="ml-2 text-sm truncate max-w-[100px] app-button-text">
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
                          {getCategoryDisplayName(category)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-grow relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="w-full p-2 rounded-lg focus:outline-none focus:ring-2 app-input"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 app-search-icon" />
              </div>
            </div>
          </div>

          <main className="flex-grow overflow-y-auto app-main-content">
            <div className="container mx-auto px-4 pb-16">
              {renderTabContent()}
            </div>
          </main>

          {showNav && (
            <nav className="app-nav">
              <div className="flex justify-around">
                {['events', 'items', 'services', 'news'].map((tab) => (
                  <button
                    key={tab}
                    className={`flex-1 py-4 app-nav-item ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => updateActiveTab(tab as TabType)}
                  >
                    {tab === 'events' && <Calendar className="h-6 w-6 mx-auto" />}
                    {tab === 'items' && <Store className="h-6 w-6 mx-auto" />}
                    {tab === 'services' && <HeartHandshake className="h-6 w-6 mx-auto" />}
                    {tab === 'news' && <Newspaper className="h-6 w-6 mx-auto" />}
                  </button>
                ))}
              </div>
            </nav>
          )}
        </div>
      )}
    </div>
  )
}

export default App