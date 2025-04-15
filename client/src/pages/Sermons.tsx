import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/lib/animations';
import { sermons } from '@/lib/data';
import { useState } from 'react';
import { Helmet } from 'react-helmet';

const Sermons = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSermon, setActiveSermon] = useState<number | null>(null);
  
  // Filter categories
  const categories = [
    { id: 'all', name: 'All Sermons' },
    { id: 'recent', name: 'Recent' },
    { id: 'popular', name: 'Most Popular' },
    { id: 'series', name: 'Series' }
  ];
  
  // Additional sermons for a longer list
  const extendedSermons = [
    ...sermons,
    {
      id: 4,
      title: "Finding Purpose in Uncertainty",
      speaker: "Pastor James Wilson",
      date: "September 17, 2023",
      series: "Purpose Series",
      description: "Discover how God's plan for your life remains steadfast even during life's most uncertain moments.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: "Unlocking Prayer",
      speaker: "David Thompson",
      date: "September 10, 2023",
      series: "Prayer Series",
      description: "Learn practical ways to deepen your prayer life and connect with God in new and meaningful ways.",
      image: "https://images.unsplash.com/photo-1532189416128-e304152d65dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: "Faith That Overcomes",
      speaker: "Rebecca Chen",
      date: "September 3, 2023",
      series: "Faith Series",
      description: "Exploring how faith empowers us to overcome obstacles and live victoriously in today's world.",
      image: "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];
  
  // Get all unique series for the filter dropdown
  const seriesList = Array.from(new Set(extendedSermons.map(sermon => sermon.series).filter(Boolean)));
  
  // Filter sermons based on active filter
  const filteredSermons = extendedSermons.filter(sermon => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recent') return new Date(sermon.date) > new Date('2023-09-15');
    if (activeFilter === 'popular') return [1, 3, 5].includes(sermon.id); // Just for demo
    if (activeFilter === 'series') return sermon.series;
    return sermon.series === activeFilter;
  });

  return (
    <>
      <Helmet>
        <title>Sermons | Kingsborough Church</title>
        <meta name="description" content="Watch and listen to sermons from Kingsborough Church. Explore our sermon library by topic, speaker, or series." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515569545471-400e3fb2bf14?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
          <div className="absolute inset-0 overlay-purple"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow">Sermons</h1>
              <p className="text-xl text-white opacity-90 font-light">
                Explore our message archive to grow in your faith journey.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 lg:px-8">
            {/* Featured sermon - latest one */}
            <motion.div 
              className="max-w-6xl mx-auto mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp()}
            >
              <div className="bg-lilac bg-opacity-5 rounded-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="h-64 lg:h-auto overflow-hidden">
                    <img 
                      src={extendedSermons[0].image}
                      alt={extendedSermons[0].title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center mb-3">
                      <span className="bg-gold text-white text-xs px-2 py-1 rounded-full uppercase tracking-wider mr-3">Latest</span>
                      {extendedSermons[0].series && (
                        <span className="text-xs bg-lilac bg-opacity-30 text-deepPurple px-2 py-1 rounded">
                          {extendedSermons[0].series}
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-montserrat font-bold mb-3 text-deepPurple">
                      {extendedSermons[0].title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">
                      <i className="far fa-user mr-2"></i> {extendedSermons[0].speaker}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <i className="far fa-calendar-alt mr-2"></i> {extendedSermons[0].date}
                    </p>
                    <p className="mb-6">{extendedSermons[0].description}</p>
                    <div className="flex space-x-4">
                      <button 
                        className="btn-primary"
                        onClick={() => setActiveSermon(extendedSermons[0].id)}
                      >
                        Watch Now
                      </button>
                      <button className="btn-outline">
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Sermon filters */}
            <motion.div 
              className="max-w-6xl mx-auto mb-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={slideUp(0.2)}
            >
              <div className="flex flex-wrap justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <div className="flex flex-wrap space-x-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        className={`px-4 py-2 rounded-full text-sm font-medium mb-2 ${
                          activeFilter === category.id
                            ? 'bg-gold text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        onClick={() => setActiveFilter(category.id)}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor="series-filter" className="font-medium text-sm">Filter by Series:</label>
                  <select
                    id="series-filter"
                    className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-gold"
                    onChange={(e) => setActiveFilter(e.target.value)}
                    value={seriesList.includes(activeFilter) ? activeFilter : ''}
                  >
                    <option value="">Select Series</option>
                    {seriesList.map(series => (
                      <option key={series} value={series}>
                        {series}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Sermon grid */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
              variants={staggerContainer()}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
            >
              {filteredSermons.map((sermon, index) => (
                <motion.div 
                  key={sermon.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                  variants={slideUp((index % 3 + 1) * 0.1)}
                  whileHover={{ 
                    y: -5,
                    boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                    transition: { duration: 0.3 }
                  }}
                >
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={sermon.image} 
                      alt={sermon.title} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-deepPurple bg-opacity-40 flex items-center justify-center">
                      <button 
                        className="text-white bg-gold bg-opacity-90 rounded-full w-14 h-14 flex items-center justify-center"
                        onClick={() => setActiveSermon(sermon.id)}
                        aria-label="Play sermon"
                      >
                        <i className="fas fa-play"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-montserrat font-semibold">{sermon.title}</h3>
                      {sermon.series && (
                        <span className="text-xs bg-lilac bg-opacity-30 text-deepPurple px-2 py-1 rounded">
                          {sermon.series}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      <i className="far fa-user mr-2"></i> {sermon.speaker}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">
                      <i className="far fa-calendar-alt mr-2"></i> {sermon.date}
                    </p>
                    <p className="mb-6 text-sm">{sermon.description}</p>
                    <div className="flex space-x-3">
                      <button 
                        className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                        onClick={() => setActiveSermon(sermon.id)}
                      >
                        <i className="fas fa-play-circle mr-1"></i> Watch
                      </button>
                      <button 
                        className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                      >
                        <i className="fas fa-headphones mr-1"></i> Listen
                      </button>
                      <button 
                        className="text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                      >
                        <i className="fas fa-file-alt mr-1"></i> Notes
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <motion.div 
              className="flex justify-center mt-12"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={slideUp(0.3)}
            >
              <div className="flex space-x-2">
                <button className="w-10 h-10 rounded-full bg-gold text-white flex items-center justify-center">
                  1
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">
                  2
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">
                  3
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
                <button className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center hover:bg-gray-300">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </motion.div>
            
            {/* Search and Subscribe */}
            <motion.div 
              className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={slideUp(0.4)}
            >
              <div className="bg-lilac bg-opacity-10 p-6 rounded-lg">
                <h3 className="text-xl font-montserrat font-semibold mb-4">Search Sermons</h3>
                <div className="flex">
                  <input 
                    type="text" 
                    placeholder="Search by topic, speaker, or keyword" 
                    className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button className="bg-gold text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </div>
              <div className="bg-deepPurple text-white p-6 rounded-lg">
                <h3 className="text-xl font-montserrat font-semibold mb-4">Subscribe to Our Podcast</h3>
                <p className="mb-4">Never miss a sermon. Subscribe to our podcast and listen on your favorite platform.</p>
                <div className="flex flex-wrap gap-2">
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 text-white px-3 py-2 rounded hover:bg-opacity-30 flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fab fa-apple mr-2"></i> Apple Podcasts
                  </a>
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 text-white px-3 py-2 rounded hover:bg-opacity-30 flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fab fa-spotify mr-2"></i> Spotify
                  </a>
                  <a 
                    href="#" 
                    className="bg-white bg-opacity-20 text-white px-3 py-2 rounded hover:bg-opacity-30 flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <i className="fas fa-rss mr-2"></i> RSS Feed
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        
        {/* Video Modal for sermon playback */}
        {activeSermon && (
          <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl mx-auto bg-white rounded-lg overflow-hidden">
              <button 
                className="absolute top-4 right-4 text-white bg-gold rounded-full w-10 h-10 flex items-center justify-center z-10"
                onClick={() => setActiveSermon(null)}
              >
                <i className="fas fa-times"></i>
              </button>
              
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="text-center p-8">
                    <i className="fas fa-video text-4xl text-gold mb-4"></i>
                    <p className="text-white text-lg">
                      Video player would load here with sermon content.
                    </p>
                    <p className="text-gray-400 mt-2">
                      Playing: {extendedSermons.find(s => s.id === activeSermon)?.title}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-montserrat font-semibold mb-2">
                  {extendedSermons.find(s => s.id === activeSermon)?.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="far fa-user mr-2"></i> 
                  {extendedSermons.find(s => s.id === activeSermon)?.speaker}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <i className="far fa-calendar-alt mr-2"></i> 
                  {extendedSermons.find(s => s.id === activeSermon)?.date}
                </p>
                <div className="flex space-x-4 mt-4">
                  <button className="btn-outline">
                    <i className="fas fa-download mr-2"></i> Download
                  </button>
                  <button className="btn-outline">
                    <i className="fas fa-share-alt mr-2"></i> Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sermons;
