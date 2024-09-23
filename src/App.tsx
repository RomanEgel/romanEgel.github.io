import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { User, Store, HeartHandshake, Calendar, MapPin, Filter, SortAsc, Search, Plus, Newspaper } from 'lucide-react'

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

interface LocalsUser {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  languageCode: string;
  allowsWriteToPm: boolean;
}

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
  const [activeTab, setActiveTab] = useState<TabType>('community')
  const [sortBy, setSortBy] = useState<SortType>('relevance')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')

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

  const items: LocalsItem[] = [
    { id: 1, title: "Vintage Bicycle", price: 150, image: "/bike.png", author: "Alice Smith", publishedAt: "2023-07-10 14:30", category: "used items", description: "Classic 1980s road bike, perfect for city commutes or weekend rides." },
    { id: 2, title: "Handmade Pottery", price: 50, image: "/pottery.png", author: "Bob Johnson", publishedAt: "2023-07-09 10:15", category: "handmade", description: "Unique, hand-crafted ceramic vase with intricate floral design." },
    { id: 3, title: "Local Honey", price: 10, image: "/honey.png", author: "Carol Williams", publishedAt: "2023-07-08 16:45", category: "food", description: "Pure, organic honey from local beekeepers. Great for tea or baking." },
    { id: 4, title: "Old Books", price: 0, image: "/old_books.png", author: "David Brown", publishedAt: "2023-07-07 09:00", category: "giveaway", description: "Collection of classic literature books in good condition. Free to a good home." },
  ]

  const services: LocalsService[] = [
    { id: 1, title: "Gardening Services", price: 25, image: "/gardening.png", author: "Eva Green", publishedAt: "2023-07-06 11:30", category: "maintenance", description: "Professional garden maintenance, including mowing, pruning, and planting." },
    { id: 2, title: "Bike Repair", price: 40, image: "/bike_repair.png", author: "Frank White", publishedAt: "2023-07-05 13:20", category: "repair", description: "Expert bicycle repair and tune-up service. Quick turnaround time." },
    { id: 3, title: "House Painting", price: 100, image: "/house_painting.png", author: "Grace Lee", publishedAt: "2023-07-04 15:10", category: "construction", description: "Interior and exterior house painting. Quality work at competitive prices." },
    { id: 4, title: "Babysitting", price: 15, image: "/baby_sitting.png", author: "Henry Davis", publishedAt: "2023-07-03 17:00", category: "care", description: "Experienced and reliable babysitter available for evenings and weekends." },
  ]

  const events: LocalsEvent[] = [
    { id: 1, title: "Community Cleanup", image: "/city_cleanup.png", date: "2023-07-15", author: "Ivy Wilson", publishedAt: "2023-07-02 08:45", category: "sport", description: "Join us for a day of cleaning up our local parks and streets. Equipment provided." },
    { id: 2, title: "Local Art Exhibition", image: "/local_art.png", date: "2023-07-22", author: "Jack Thompson", publishedAt: "2023-07-01 14:30", category: "art", description: "Showcase of talented local artists featuring paintings, sculptures, and photography." },
    { id: 3, title: "Startup Networking Event", image: "/networking.png", date: "2023-07-29", author: "Karen Martinez", publishedAt: "2023-06-30 11:20", category: "business", description: "Connect with local entrepreneurs and investors. Great opportunity for networking." },
    { id: 4, title: "Group Hiking Trip", image: "/group_hiking.png", date: "2023-08-05", author: "Liam Anderson", publishedAt: "2023-06-29 16:15", category: "travelling", description: "Scenic 10km hike through beautiful forest trails. Suitable for all fitness levels." },
  ]

  const news: LocalsNews[] = [
    { id: 1, title: "New Community Center Opening", image: "/community_center.png", author: "City Council", publishedAt: "2023-07-12 09:00", category: "local", description: "Grand opening of our new state-of-the-art community center this weekend." },
    { id: 2, title: "Local Artist Wins National Award", image: "/artist_award.png", author: "Arts Committee", publishedAt: "2023-07-11 14:30", category: "culture", description: "Lisbon-based painter Maria Santos receives prestigious national art award." },
    { id: 3, title: "Beach Cleanup Initiative Launched", image: "/beach_cleanup.png", author: "Environmental Group", publishedAt: "2023-07-10 11:15", category: "environment", description: "New program aims to keep our beaches clean with weekly volunteer events." },
    { id: 4, title: "Local Restaurant Week Announced", image: "/restaurant_week.png", author: "Tourism Board", publishedAt: "2023-07-09 16:45", category: "food", description: "Annual event showcasing the best of Lisbon's culinary scene starts next month." },
  ]

  const getCategories = () => {
    switch (activeTab) {
      case 'community':
        return ['all', 'my events', 'sport', 'art', 'business', 'travelling']
      case 'items':
        return ['all', 'my items', 'food', 'handmade', 'giveaway', 'used items']
      case 'services':
        return ['all', 'my services', 'repair', 'maintenance', 'construction', 'care']
      case 'news':
        return ['all', 'local', 'culture', 'environment', 'food']
      default:
        return ['all']
    }
  }

  const categories = useMemo(() => getCategories(), [activeTab])

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
    return (
      <div className="flex flex-col space-y-4 mb-16">
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
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black p-2 fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center">
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

      <div className="bg-gray-800 py-2 px-4 fixed top-10 left-0 right-0 z-10 flex items-center space-x-2">
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
        <button 
          className="p-2 rounded-lg bg-green-600 hover:bg-green-700 flex items-center"
          onClick={() => {/* Add functionality here */}}
        >
          <Plus className="h-5 w-5 mr-1" />
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>

      <main className="container mx-auto p-4 pt-28 pb-24">
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