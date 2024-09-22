import { useState, useMemo } from 'react'
import { Search, User, ShoppingBag, Briefcase, Calendar, ChevronDown } from 'lucide-react'

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
type SortType = 'relevance' | 'date'
type ListItem = Item | Service | Event;


function App() {
  const [activeTab, setActiveTab] = useState<TabType>('community')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortType>('relevance')
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

    if (searchQuery) {
      result = result.filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    return result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      }
      return 0 // For 'relevance', we'd typically use a more complex algorithm
    })
  }, [activeTab, activeCategory, searchQuery, sortBy, items, services, events])

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
      <header className="bg-black p-4 fixed top-0 left-0 right-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Locals Only</h1>
          <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
            <User className="h-6 w-6" />
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4 pt-20 pb-24">
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 pl-10 rounded-lg border border-gray-700 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="mb-6 flex justify-between">
          <div className="relative inline-block text-left">
            <div>
              <button 
                type="button" 
                className="inline-flex justify-center w-full rounded-md border border-gray-700 shadow-sm px-4 py-2 bg-gray-800 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500" 
                id="menu-button" 
                aria-expanded={isDropdownOpen} 
                aria-haspopup="true"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {getCategoryDisplayName(activeCategory)}
                <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {isDropdownOpen && (
              <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}>
                <div className="py-1" role="none">
                  {categories.map((category) => (
                    <a
                      key={category}
                      href="#"
                      className="text-white block px-4 py-2 text-sm hover:bg-gray-700"
                      role="menuitem"
                      tabIndex={-1}
                      id={`menu-item-${category}`}
                      onClick={() => {
                        setActiveCategory(category)
                        setIsDropdownOpen(false)
                      }}
                    >
                      {getCategoryDisplayName(category)}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="block w-32 py-2 px-3 border border-gray-700 bg-gray-800 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
          </select>
        </div>

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