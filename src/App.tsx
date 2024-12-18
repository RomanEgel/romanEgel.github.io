import WebApp from '@twa-dev/sdk';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Store, HeartHandshake, Calendar, MapPin, Filter, Search, Newspaper, UserCircle2, Loader2, ChevronLeft, ChevronRight, Bell } from 'lucide-react'
import { fetchItems, fetchServices, fetchEvents, fetchNews, deleteItem, deleteService, deleteEvent, deleteNews, updateItem, updateService, updateEvent, updateNews, getLinkToUserProfile, findAdvertisementForCommunity, getLinkToUserProfileForAdvertisement } from './apiService'
import { useAuth } from './AuthContext'
import { translations } from './localization';
import StorageManager from './StorageManager';
import CardDetailView from './CardDetailView';
import { formatDate, formatPrice, createTranslationFunction } from './utils';
import { LocalsCommunity, LocalsUser, LocalsItem, LocalsService, LocalsEvent, LocalsNews, ListItem, Advertisement } from './types';


type TabType = 'events' | 'items' | 'services' | 'news'

interface AppProps {
  community: LocalsCommunity;
  user: LocalsUser;
  focusEntityType?: string;
  focusEntityId?: string;
}

const ImageCarousel = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-24 h-24 flex-shrink-0 bg-gray-200 app-image-container" />
    );
  }

  return (
    <div 
      className="w-24 h-24 flex-shrink-0 relative app-image-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img 
        src={images[currentIndex]} 
        alt="Item" 
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ objectPosition: '50% 50%' }}
      />
      {images.length > 1 && isHovered && (
        <>
          <button 
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black/30 p-0.5 rounded-r transition-opacity duration-200"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
          <button 
            onClick={goToNext}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black/30 p-0.5 rounded-l transition-opacity duration-200"
          >
            <ChevronRight className="h-4 w-4 text-white" />
          </button>
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1 transition-opacity duration-200">
            {images.map((_, index) => (
              <div 
                key={index}
                className={`h-1 w-1 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

function App({ community, user, focusEntityType, focusEntityId }: AppProps) {
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
    if (category === 'Uncategorized') {
      return t('uncategorized');
    }
    if (category.startsWith('my ')) {
      const type = category.split(' ')[1];
      return t(`my ${type}` as keyof typeof translations.en);
    }
    return category.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  }

  // Add this new state
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Add this new state
  const [advertisement, setAdvertisement] = useState<Advertisement | null>(null);

  // Modify the fetchData function
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [itemsResponse, servicesResponse, eventsResponse, newsResponse, adResponse] = await Promise.all([
        fetchItems(authorization, community.id),
        fetchServices(authorization, community.id),
        fetchEvents(authorization, community.id),
        fetchNews(authorization, community.id),
        findAdvertisementForCommunity(authorization, community.id)
      ]);

      setItems(itemsResponse['items']);
      setServices(servicesResponse['services']);
      setEvents(eventsResponse['events']);
      setNews(newsResponse['news']);
      
      // Only set advertisement if it exists in the response
      if (adResponse && adResponse['advertisement']) {
        console.log('Setting advertisement:', adResponse['advertisement']);
        setAdvertisement(adResponse['advertisement']);
      } else {
        setAdvertisement(null);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Ensure advertisement is cleared in case of error
      setAdvertisement(null);
    } finally {
      setIsLoading(false)
    }
  };

  // Modify the scrollToEntity function
  const scrollToEntity = (entityId: string, retries = 5) => {
    const targetElement = document.querySelector(`[data-entity-id="${entityId}"]`);
    if (targetElement) {
      console.log('Found target element, scrolling...');
      
      // Ensure we have full viewport height
      WebApp.expand();
      
      // Get the main content container
      const mainContent = document.querySelector('.app-main-content');
      if (mainContent) {
        // Calculate scroll position considering fixed header height (110px)
        const headerOffset = 110;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition - headerOffset;

        mainContent.scrollBy({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }

      targetElement.classList.add('app-highlight-item');
      setTimeout(() => {
        targetElement.classList.remove('app-highlight-item');
      }, 2000);
    } else if (retries > 0) {
      console.log(`Element not found, retrying... (${retries} attempts left)`);
      setTimeout(() => scrollToEntity(entityId, retries - 1), 500);
    } else {
      console.log('Failed to find element after all retries');
      WebApp.showAlert(t('failedToFindEntity'));
    }
  };

  // Modify the useEffect for data fetching
  useEffect(() => {
    const init = async () => {
      await fetchData();
      
      if (focusEntityType && focusEntityId) {
        console.log('Focusing on:', { focusEntityType, focusEntityId });
        setActiveTab(focusEntityType as TabType);
        scrollToEntity(focusEntityId);
      } else {
        // Retrieve the last active tab from StorageManager
        const value = await StorageManager.getItem('lastActiveTab');
        if (value) {
          setActiveTab(value as TabType);
        }
      }
    };

    init();
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
    const hasUserRecords = result.some(item => item.userId === user.id);
    if (hasUserRecords) {
      categories.unshift(`my ${activeTab}`);
    }

    return categories;
  };

  const categories = useMemo(() => getCategories(), [activeTab, items, services, events, news, user.id]);

  const filteredItems = useMemo(() => {
    let result: ListItem[] = 
      activeTab === 'events' ? events : 
      activeTab === 'items' ? items : 
      activeTab === 'services' ? services :
      news

    if (activeCategory.startsWith('my ')) {
      result = result.filter(item => item.userId === user.id)
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
  }, [activeTab, activeCategory, searchQuery, items, services, events, news, user.id])

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

  // Add this method before the renderTabContent function
  const handleAdvertisementClick = (advertisement: Advertisement) => {
    getLinkToUserProfileForAdvertisement(advertisement.id, authorization, community.id)
      .then(link => {
        const message = t('interestedInAd').replace('{{title}}', advertisement.title);
        openTelegramLink(`${link}?text=${encodeURIComponent(message)}`);
      })
      .catch(error => {
        console.error('Error getting user profile link for advertisement:', error);
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

    return (
      <div className="flex flex-col space-y-4 mb-16 w-full">
        {advertisement && (
          <div 
            className="rounded-lg shadow overflow-hidden flex items-center cursor-pointer app-card relative"
            onClick={() => advertisement && handleAdvertisementClick(advertisement)}
          >
            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500 text-white text-xs rounded-md z-10">
              {t('sponsored')}
            </div>
            <ImageCarousel images={advertisement.images || []} />
            <div className="p-4 flex-grow min-w-0">
              <h3 className="font-semibold truncate text-base mb-1 app-text">{advertisement.title}</h3>
              <p className="font-bold app-price text-sm">
                {formatPrice(advertisement.price, advertisement.currency, community.language)}
              </p>
              <p className="text-sm mt-1 line-clamp-2 app-subtitle">{advertisement.description}</p>
            </div>
          </div>
        )}

        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-4">
            <p className="text-center app-hint mb-4">{(() => {
              switch (activeTab) {
                case 'events': return t('noEventsFound');
                case 'items': return t('noItemsFound');
                case 'services': return t('noServicesFound');
                case 'news': return t('noNewsFound');
                default: throw new Error('Invalid tab');
              }
            })()}</p>
            <div className="app-card rounded-lg p-4 max-w-sm">
              <p className="text-center app-hint text-sm mb-2">
                {t('createNewEntityInstructionPart1').replace('{{entityType}}', (() => {
                  switch (activeTab) {
                    case 'events': return t('event');
                    case 'items': return t('item');
                    case 'services': return t('service');
                    case 'news': return t('news');
                    default: throw new Error('Invalid tab');
                  }
                })())}
              </p>
              <div className="rounded border p-2 text-center">
                <span className="font-mono app-accent font-semibold">
                  {(() => {
                    const entitySettings = community.entitySettings;
                    switch (activeTab) {
                      case 'events': return entitySettings.eventHashtag;
                      case 'items': return entitySettings.itemHashtag;
                      case 'services': return entitySettings.serviceHashtag;
                      case 'news': return entitySettings.newsHashtag;
                      default: throw new Error('Invalid tab');
                    }
                  })()}
                </span>
              </div>
              <p className="text-center app-hint text-sm mt-2">
                {t('createNewEntityInstructionPart2')}
              </p>
            </div>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div 
              key={item.id}
              data-entity-id={item.id}
              onClick={() => handleItemClick(item)}
              className="rounded-lg shadow overflow-hidden flex items-center cursor-pointer app-card relative"
            >
              <ImageCarousel images={item.images || []} />
              {item.userId === user.id && (
                <div className="absolute top-1 left-1 bg-blue-500 text-white p-1 rounded-full">
                  <UserCircle2 className="h-4 w-4" />
                </div>
              )}
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
                        getLinkToUserProfile(item.userId, authorization, community.id).then(link => {
                          openTelegramLink(link);
                        }).catch(error => {
                          console.error('Error getting user profile link:', error);
                        });
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
          ))
        )}
      </div>
    );
  };

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
    // Blur the specific search input element
    const searchInputElement = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInputElement) {
      searchInputElement.blur();
    }
    WebApp.expand();
    setTimeout(() => {
      setShowNav(true);
    }, 200);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleInputBlur();
    }
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
          await updateItem(item as LocalsItem, authorization, community.id);
          break;
        case 'services':
          await updateService(item as LocalsService, authorization, community.id);
          break;
        case 'events':
          await updateEvent(item as LocalsEvent, authorization, community.id);
          break;
        case 'news':
          await updateNews(item as LocalsNews, authorization, community.id);
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
          await deleteItem(item_id, authorization, community.id);
          break;
        case 'services':
          await deleteService(item_id, authorization, community.id);
          break;
        case 'events':
          await deleteEvent(item_id, authorization, community.id  );
          break;
        case 'news':
          await deleteNews(item_id, authorization, community.id);
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

  useEffect(() => {
    const handleTouchStart = (event: TouchEvent) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        handleInputBlur();
      }
    };

    document.addEventListener('touchstart', handleTouchStart);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const handleOpenUserProfile = (userId: string, text: string) => {
    getLinkToUserProfile(userId, authorization, community.id).then(link => {
      openTelegramLink(`${link}?text=${encodeURIComponent(text)}`);
    }).catch(error => {
      console.error('Error getting user profile link:', error);
    });
  };

  function enableNotificationsForUser(): void {
    openTelegramLink(`https://t.me/locals_only_bot?text=${encodeURIComponent(`/enable_notifications`)}`);
  }

  return (
    <div className="min-h-screen flex flex-col app-body">
      {selectedItem ? (
        <CardDetailView
          item={selectedItem}
          community={community}
          active_tab={activeTab}
          onOpenUserProfile={handleOpenUserProfile}
          onClose={handleCloseDetailView}
          communityLanguage={community.language}
          isCurrentUserAuthor={selectedItem.userId === user.id}
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
              {!user.notifications_enabled && (
                <div className="flex items-center">
                  <button className={`p-1 rounded-full app-button`} onClick={() => enableNotificationsForUser()}>
                    <Bell className="h-5 w-5" />
                  </button>
                </div>
              )}
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
              <div className={`relative ${isInputFocused ? 'flex-grow' : 'flex-grow'}`}>
                <input
                  id="searchInput"
                  ref={searchInputRef}
                  type="text"
                  placeholder={t('search')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onKeyPress={handleKeyPress}
                  className="w-full p-2 pr-10 rounded-lg focus:outline-none focus:ring-2 app-input"
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