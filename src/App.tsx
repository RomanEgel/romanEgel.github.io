import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { User, Store, HeartHandshake, Calendar, MapPin, Filter, SortAsc, Search, Plus, Newspaper } from 'lucide-react'
import { fetchItems, fetchServices, fetchEvents, fetchNews } from './apiService' // Import the service functions
import { useAuth } from './AuthContext'; // Import the useAuth hook

interface LocalsItem {
  id: number
  title: string
  price: number
  image: string
  author: string
  publishedAt: string
  category: string
  description: string
}

interface LocalsService {
  id: number
  title: string
  price: number
  image: string
  author: string
  publishedAt: string
  category: string
  description: string
}

interface LocalsEvent {
  id: number
  title: string
  date: string
  image: string
  author: string
  publishedAt: string
  category: string
  description: string
}

interface LocalsNews {
  id: number
  title: string
  image: string
  author: string
  publishedAt: string
  category: string
  description: string
}

type TabType = 'community' | 'items' | 'services' | 'news'
type SortType = 'relevance' | 'dateAsc'
type ListItem = LocalsItem | LocalsService | LocalsEvent | LocalsNews;

interface LocalsCommunity {
  id: number;
  name: string;
  description: string;
  membersCount: number;
}

interface AppProps {
  community: LocalsCommunity;
}

function App({ community }: AppProps) {
  const { authorization } = useAuth(); // Use the authorization value from context
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
      return 0 // For 'relevance', we'd typically use a more complex algorithm
    })
  }, [activeTab, activeCategory, sortBy, searchQuery, items, services, events, news])

  useEffect(() => {
    setActiveCategory('all')
  }, [activeTab])

  const renderTabContent = () => {
    if (filteredAndSortedItems.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <p className="text-center text-gray-400">No records found.</p>
        </div>
      );
    }
    return (
      <div className="flex flex-col space-y-4 mb-16 w-full">
        {filteredAndSortedItems.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg shadow overflow-hidden flex items-center">
            <div className="w-24 h-24 flex-shrink-0 relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="p-4 flex-grow min-w-0">
              <h3 className="font-semibold text-white truncate">{item.title}</h3>
              {'price' in item && <p className="text-green-400 font-bold">${item.price}</p>}
              {'date' in item && <p className="text-green-400 font-bold">{item.date}</p>}
              <p className="text-sm text-gray-300 mt-1 line-clamp-2">{item.description}</p>
              <p className="text-xs text-gray-400 mt-2 truncate">
                Posted by {item.author} on {item.publishedAt}
              </p>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <header className="bg-black p-2 fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center text-center">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-sm">{community.name}</span>
          </div>
          <div className="flex items-center">
            <button className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gray-800 py-2 px-4 fixed top-10 left-0 right-0 z-10 flex items-center space-x-2 text-center">
        <div className="relative">
          <button 
            ref={filterButtonRef}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center justify-center"
            onClick={() => toggleDropdown('filter')}
          >
            <Filter className="h-5 w-5" />
            {activeCategory !== 'all' && (
              <span className="ml-2 text-sm truncate max-w-[100px]">
                {getCategoryDisplayName(activeCategory)}
              </span>
            )}
          </button>
          {activeDropdown === 'filter' && (
            <div 
              ref={filterDropdownRef} 
              className="absolute left-0 top-full mt-1 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div className="py-1">
                <p className="px-4 py-2 text-sm text-gray-400">Filter by category:</p>
                {categories.map((category) => (
                  <a
                    key={category}
                    href="#"
                    className={`block px-4 py-2 text-sm ${activeCategory === category ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
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
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <div className="relative">
          <button 
            ref={sortButtonRef}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 flex items-center"
            onClick={() => toggleDropdown('sort')}
          >
            <SortAsc className="h-5 w-5" />
          </button>
          {activeDropdown === 'sort' && (
            <div 
              ref={sortDropdownRef} 
              className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
            >
              <div className="py-1">
                <p className="px-4 py-2 text-sm text-gray-400">Sort results:</p>
                <a
                  href="#"
                  className={`block px-4 py-2 text-sm ${sortBy === 'relevance' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  onClick={() => {
                    setSortBy('relevance')
                    setActiveDropdown(null)
                  }}
                >
                  Relevance
                </a>
                <a
                  href="#"
                  className={`block px-4 py-2 text-sm ${sortBy === 'dateAsc' ? 'bg-gray-700 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                  onClick={() => {
                    setSortBy('dateAsc')
                    setActiveDropdown(null)
                  }}
                >
                  Date (Oldest)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <main className="container mx-auto p-4 pt-28 pb-24 flex-grow flex flex-col items-center">
        {renderTabContent()}
      </main>

      <nav className="bg-black fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          <button
            className={`flex-1 py-4 ${activeTab === 'community' ? 'text-green-500' : 'text-white'}`}
            onClick={() => setActiveTab('community')}
          >
            <Calendar className="h-6 w-6 mx-auto" />
          </button>
          <button
            className={`flex-1 py-4 ${activeTab === 'items' ? 'text-green-500' : 'text-white'}`}
            onClick={() => setActiveTab('items')}
          >
            <Store className="h-6 w-6 mx-auto" />
          </button>
          <button
            className={`flex-1 py-4 ${activeTab === 'services' ? 'text-green-500' : 'text-white'}`}
            onClick={() => setActiveTab('services')}
          >
            <HeartHandshake className="h-6 w-6 mx-auto" />
          </button>
          <button
            className={`flex-1 py-4 ${activeTab === 'news' ? 'text-green-500' : 'text-white'}`}
            onClick={() => setActiveTab('news')}
          >
            <Newspaper className="h-6 w-6 mx-auto" />
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App