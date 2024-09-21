import { useState } from 'react'
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('')

  const marketplaceItems = [
    { name: 'Vintage Bicycle', price: 150, image: 'bike.png' },
    { name: 'Handmade Pottery', price: 50, image: 'pottery.png' },
    { name: 'Local Honey', price: 10, image: 'honey.png' },
    { name: 'Gardening Services', price: 25, image: 'gardening.png' },
  ]

  const events = [
    { name: 'Community Cleanup', date: '2023-07-15' },
    { name: 'Local Art Exhibition', date: '2023-07-22' },
  ]

  const news = [
    'New Park Opening Next Month',
    'Local Business Spotlight: Cafe Aroma',
  ]

  return (
    <div className="community-hub">
      <header>
        <h1>Locals Only</h1>
        <input
          type="text"
          placeholder="Search marketplace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </header>
      
      <main>
        <section className="marketplace">
          {marketplaceItems.map((item, index) => (
            <div key={index} className="item">
              <img 
                src={`${import.meta.env.BASE_URL}${item.image}`} 
                alt={item.name}
                className="item-image"
              />
              <h3>{item.name}</h3>
              <p>${item.price}</p>
            </div>
          ))}
        </section>
        
        <aside className="community-updates">
          <h2>Community Updates</h2>
          <section>
            <h3>Upcoming Events</h3>
            {events.map((event, index) => (
              <div key={index}>
                <p>{event.name}</p>
                <p>{event.date}</p>
              </div>
            ))}
          </section>
          <section>
            <h3>Local News</h3>
            {news.map((item, index) => (
              <p key={index}>{item}</p>
            ))}
          </section>
        </aside>
      </main>
    </div>
  )
}

export default App