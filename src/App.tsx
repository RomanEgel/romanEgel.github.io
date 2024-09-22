import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { User, ShoppingBag, Briefcase, Calendar, MapPin, Filter, SortAsc, Search } from 'lucide-react'

interface Item {
  id: number
  title: string
  price: number
  image: string
  author: string
  publishedAt: string
  category: string
}

interface Service {
  id: number
  title: string
  price: number
  image: string
  author: string
  publishedAt: string
  category: string
}

interface Event {
  id: number
  title: string
  date: string
  image: string
  author: string
  publishedAt: string
  category: string
}

type TabType = 'community' | 'items' | 'services'
type SortType = 'relevance' | 'dateAsc'
type ListItem = Item | Service | Event;

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('community')
  const [sortBy, setSortBy] = useState<SortType>('relevance')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [activeDropdown, setActiveDropdown] = useState<'filter' | 'sort' | null>(null)

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

  const items: Item[] = [
    { id: 1, title: "Vintage Bicycle", price: 150, image: "/bike.png", author: "Alice Smith", publishedAt: "2023-07-10 14:30", category: "used items" },
    { id: 2, title: "Handmade Pottery", price: 50, image: "/pottery.png", author: "Bob Johnson", publishedAt: "2023-07-09 10:15", category: "handmade" },
    { id: 3, title: "Local Honey", price: 10, image: "/honey.png", author: "Carol Williams", publishedAt: "2023-07-08 16:45", category: "food" },
    { id: 4, title: "Old Books", price: 0, image: "/old_books.png", author: "David Brown", publishedAt: "2023-07-07 09:00", category: "giveaway" },
  ]

  const services: Service[] = [
    { id: 1, title: "Gardening Services", price: 25, image: "/gardening.png", author: "Eva Green", publishedAt: "2023-07-06 11:30", category: "maintenance" },
    { id: 2, title: "Bike Repair", price: 40, image: "/bike_repair.png", author: "Frank White", publishedAt: "2023-07-05 13:20", category: "repair" },
    { id: 3, title: "House Painting", price: 100, image: "/house_painting.png", author: "Grace Lee", publishedAt: "2023-07-04 15:10", category: "construction" },
    { id: 4, title: "Babysitting", price: 15, image: "/baby_sitting.png", author: "Henry Davis", publishedAt: "2023-07-03 17:00", category: "care" },
  ]

  const events: Event[] = [
    { id: 1, title: "Community Cleanup", image: "/city_cleanup.png", date: "2023-07-15", author: "Ivy Wilson", publishedAt: "2023-07-02 08:45", category: "sport" },
    { id: 2, title: "Local Art Exhibition", image: "/local_art.png", date: "2023-07-22", author: "Jack Thompson", publishedAt: "2023-07-01 14:30", category: "art" },
    { id: 3, title: "Startup Networking Event", image: "/networking.png", date: "2023-07-29", author: "Karen Martinez", publishedAt: "2023-06-30 11:20", category: "business" },
    { id: 4, title: "Group Hiking Trip", image: "/group_hiking.png", date: "2023-08-05", author: "Liam Anderson", publishedAt: "2023-06-29 16:15", category: "travelling" },
  ]

  const getCategories = () => {
    switch (activeTab) {
      case 'community':
        return ['all', 'sport', 'art', 'business', 'travelling']
      case 'items':
        return ['all', 'food', 'handmade', 'giveaway', 'used items']
      case 'services':
        return ['all', 'repair', 'maintenance', 'construction', 'care']
      default:
        return ['all']
    }
  }

  const categories = useMemo(() => getCategories(), [activeTab])

  const filteredAndSortedItems = useMemo(() => {
    let result: ListItem[] = activeTab === 'community' ? events : activeTab === 'items' ? items : services

    if (activeCategory !== 'all') {
      result = result.filter(item => item.category === activeCategory)
    }

    return result.sort((a, b) => {
      if (sortBy === 'dateAsc') {
        return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      }
      return 0 // For 'relevance', we'd typically use a more complex algorithm
    })
  }, [activeTab, activeCategory, sortBy, items, services, events])

  useEffect(() => {
    setActiveCategory('all')
  }, [activeTab])

  const renderTabContent = () => {
    return (
      <div className="grid grid-cols-2 gap-4 mb-16">
        {filteredAndSortedItems.map((item) => (
          <div key={item.id} className="bg-gray-800 rounded-lg shadow overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-32 object-cover" />
            <div className="p-4">
              <h3 className="font-semibold text-white">{item.title}</h3>
              {'price' in item && <p className="text-green-400 font-bold">${item.price}</p>}
              {'date' in item && <p className="text-green-400 font-bold">{item.date}</p>}
              <p className="text-xs text-gray-400 mt-2">
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
            <img src="/icon.png" alt="Locals Only Icon" className="h-6 w-6 mr-2" />
            <h1 className="text-lg font-bold">Locals Only</h1>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-green-500 mr-1" />
            <span className="mr-4 text-sm">Lisbon Surfing</span>
            <button className="p-1 rounded-full bg-gray-800 hover:bg-gray-700">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="bg-gray-800 py-1 px-2 fixed top-10 left-0 right-0 z-10 flex justify-end space-x-2">
        <button 
          className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center"
          onClick={() => {/* Add search functionality here */}}
        >
          <Search className="h-4 w-4" />
        </button>
        <div className="relative">
          <button 
            ref={filterButtonRef}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center"
            onClick={() => toggleDropdown('filter')}
          >
            <Filter className="h-4 w-4" />
            {activeCategory !== 'all' && (
              <span className="ml-2 text-xs">{getCategoryDisplayName(activeCategory)}</span>
            )}
          </button>
          {activeDropdown === 'filter' && (
            <div 
              ref={filterDropdownRef} 
              className="absolute right-0 top-full mt-1 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
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
        <div className="relative">
          <button 
            ref={sortButtonRef}
            className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center"
            onClick={() => toggleDropdown('sort')}
          >
            <SortAsc className="h-4 w-4" />
            <span className="ml-2 text-xs">
              {sortBy === 'relevance' ? 'Relevance' : 'Date (Oldest)'}
            </span>
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

      <main className="container mx-auto p-4 pt-20 pb-24">
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
            <ShoppingBag className="h-6 w-6 mx-auto" />
          </button>
          <button
            className={`flex-1 py-4 ${activeTab === 'services' ? 'text-green-500' : 'text-white'}`}
            onClick={() => setActiveTab('services')}
          >
            <Briefcase className="h-6 w-6 mx-auto" />
          </button>
        </div>
      </nav>
    </div>
  )
}

export default App