import { motion, AnimatePresence } from 'framer-motion';
import { slideUp, staggerContainer, fadeIn, slideRight } from '@/lib/animations';
import { sermons } from '@/lib/data';
import { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { useGsapAnimations } from '@/hooks/use-gsap-animations';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import YouTubeVideoList from '@/components/sermons/YouTubeVideoList';
import YouTubeLatestVideo from '@/components/sermons/YouTubeLatestVideo';

gsap.registerPlugin(ScrollTrigger);

const Sermons = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSermon, setActiveSermon] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSeries, setActiveSeries] = useState<string | null>(null);
  const { createScrollAnimation } = useGsapAnimations();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);

  // Filter categories
  const categories = [
    { id: 'all', name: 'All Sermons' },
    { id: 'recent', name: 'Recent' },
    { id: 'apostle-tunde', name: 'Apostle Tunde' },
    { id: 'pastor-toyin', name: 'Pastor Toyin' }
  ];
  
  // Extended sermons list
  const extendedSermons = [
    ...sermons,
    {
      id: 4,
      title: "The Kingdom Mindset",
      speaker: "Apostle Tunde Balogun",
      date: "March 24, 2024",
      series: "Kingdom Series",
      description: "Discover how adopting a Kingdom mindset transforms your perspective on life's challenges and opportunities.",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 5,
      title: "Overflow: Living from Abundance",
      speaker: "Pastor Toyin Balogun",
      date: "March 17, 2024",
      series: "Abundance Series",
      description: "Learn how to live from God's abundance rather than striving from a place of lack.",
      image: "https://images.unsplash.com/photo-1532189416128-e304152d65dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    },
    {
      id: 6,
      title: "Breaking Spiritual Barriers",
      speaker: "Apostle Tunde Balogun",
      date: "March 10, 2024",
      series: "Breakthrough Series",
      description: "Understanding and overcoming the spiritual barriers that prevent you from reaching your divine destiny.",
      image: "https://images.unsplash.com/photo-1545128485-c400e7702796?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
    }
  ];
  
  // Get all unique series for the filter
  const seriesList = Array.from(new Set(extendedSermons.map(sermon => sermon.series).filter(Boolean)));
  
  useEffect(() => {
    // Add parallax effect to hero section
    if (heroRef.current) {
      const parallaxBg = heroRef.current.querySelector('.parallax-bg');
      if (parallaxBg) {
        createScrollAnimation(
          parallaxBg,
          { y: '30%' },
          { trigger: heroRef.current, scrub: true, start: 'top top', end: 'bottom top' }
        );
      }
    }

    // Animate featured sermon on scroll
    if (featuredRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: featuredRef.current,
          start: 'top 70%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      });
      
      tl.fromTo(
        featuredRef.current.querySelector('.featured-image'),
        { scale: 1.1, opacity: 0.7 },
        { scale: 1, opacity: 1, duration: 1, ease: 'power2.out' }
      );
      
      tl.fromTo(
        featuredRef.current.querySelector('.featured-content'),
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        '-=0.8'
      );
    }
    
    return () => {
      // Clean up ScrollTrigger instances
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [createScrollAnimation]);

  // Filter sermons based on active filter, search query, and active series
  const filteredSermons = extendedSermons.filter(sermon => {
    // Filter by category
    if (activeFilter === 'apostle-tunde' && !sermon.speaker.includes('Apostle Tunde')) return false;
    if (activeFilter === 'pastor-toyin' && !sermon.speaker.includes('Pastor Toyin')) return false;
    if (activeFilter === 'recent' && new Date(sermon.date) < new Date('2024-03-20')) return false;
    
    // Filter by series if active
    if (activeSeries && sermon.series !== activeSeries) return false;
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        sermon.title.toLowerCase().includes(query) ||
        sermon.speaker.toLowerCase().includes(query) ||
        sermon.description.toLowerCase().includes(query) ||
        (sermon.series && sermon.series.toLowerCase().includes(query))
      );
    }
    
    return true;
  });

  return (
    <>
      <Helmet>
        <title>Sermons | Kingsborough Church</title>
        <meta name="description" content="Watch and listen to sermons from Kingsborough Church. Explore our library of powerful messages from Apostle Tunde and Pastor Toyin Balogun." />
      </Helmet>
      
      {/* Hero Section */}
      <div ref={heroRef} className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background with Overlay */}
        <div 
          className="parallax-bg absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1601065300289-84f1d99fab1c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=85')` }}
        ></div>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-deepPurple/60 to-black/80"></div>
        
        {/* Content */}
        <div className="container relative z-10 px-4 lg:px-8 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={slideUp()}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-montserrat font-bold text-white mb-6 tracking-tight">
              Word of Life
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light max-w-2xl mx-auto mb-10">
              Explore transformative messages that will inspire your faith journey and bring spiritual renewal.
            </p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              variants={staggerContainer(0.1)}
              initial="hidden"
              animate="visible"
            >
              <motion.a 
                href="#latest-sermons" 
                className="btn-primary-lg"
                variants={fadeIn(0.2)}
              >
                Latest Messages
              </motion.a>
              <motion.a 
                href="#series" 
                className="btn-outline-white-lg"
                variants={fadeIn(0.3)}
              >
                Browse by Series
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        ></motion.div>
      </div>

      {/* Featured Sermon Section */}
      <section ref={featuredRef} className="py-20 bg-white" id="latest-sermons">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-3xl md:text-5xl font-montserrat font-bold text-deepPurple mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Latest Message
            </motion.h2>
            <motion.div 
              className="w-20 h-1 bg-gold mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 80 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            ></motion.div>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Experience the most recent sermon from our pastoral team
            </motion.p>
          </div>

          <div className="max-w-6xl mx-auto relative overflow-hidden rounded-xl shadow-2xl group">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Large Featured Image (3/5 width on large screens) */}
              <div className="featured-image lg:col-span-3 h-80 lg:h-auto overflow-hidden relative">
                <img 
                  src={extendedSermons[0].image}
                  alt={extendedSermons[0].title}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => setActiveSermon(extendedSermons[0].id)}
                    className="w-20 h-20 rounded-full bg-gold flex items-center justify-center transform transition-transform duration-300 hover:scale-110"
                    aria-label="Play sermon"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Content (2/5 width on large screens) */}
              <div className="featured-content lg:col-span-2 p-8 bg-white flex flex-col justify-center">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="bg-gold text-white text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                    Latest
                  </span>
                  {extendedSermons[0].series && (
                    <span className="text-xs bg-deepPurple/10 text-deepPurple px-3 py-1 rounded-full">
                      {extendedSermons[0].series}
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-3 text-deepPurple group-hover:text-gold transition-colors duration-300">
                  {extendedSermons[0].title}
                </h3>
                
                <p className="text-sm text-gray-600 mb-2 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {extendedSermons[0].speaker}
                </p>
                
                <p className="text-sm text-gray-600 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {extendedSermons[0].date}
                </p>
                
                <p className="mb-6 text-gray-700">{extendedSermons[0].description}</p>
                
                <div className="flex flex-wrap gap-3">
                  <button 
                    className="px-6 py-3 bg-gold text-white rounded-lg shadow-md hover:bg-deepPurple transition-colors duration-300 flex items-center"
                    onClick={() => setActiveSermon(extendedSermons[0].id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Watch Now
                  </button>
                  
                  <button className="px-6 py-3 border-2 border-deepPurple text-deepPurple rounded-lg hover:bg-deepPurple hover:text-white transition-colors duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Sermons Section */}
      <section id="sermon-list" className="py-16 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Title */}
            <div className="mb-12">
              <h2 className="text-3xl font-montserrat font-bold text-deepPurple mb-4">
                Latest YouTube Sermons
              </h2>
              <div className="w-20 h-1 bg-gold mb-6"></div>
              <p className="text-lg text-gray-600 max-w-2xl">
                Watch our latest sermons streamed directly from our YouTube channel
              </p>
            </div>

            {/* YouTube Video Component */}
            <motion.div 
              className="w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <YouTubeVideoList 
                channelId="UCGYKC04rR0F7ajcuVQqupRQ" 
                maxVideos={9} 
              />
            </motion.div>
            
            {/* Original Content - To be available for reference if needed */}
            {false && (
            <div className="hidden">
              {/* Title with active filters */}
              <div className="mb-12">
                <h2 className="text-3xl font-montserrat font-bold text-deepPurple mb-2">
                  {activeSeries ? `${activeSeries} Series` : 'All Messages'}
                </h2>
                {activeSeries && (
                  <button 
                    onClick={() => setActiveSeries(null)}
                    className="text-gold hover:text-deepPurple transition-colors flex items-center mb-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all sermons
                  </button>
                )}
              </div>

              {/* Search and Filter Controls */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        activeFilter === category.id
                          ? 'bg-gold text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveFilter(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
                
                <div className="w-full md:w-auto flex">
                  <input
                    type="text"
                    placeholder="Search messages..."
                    className="px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button 
                    className="bg-gold text-white px-4 py-2 rounded-r-lg hover:bg-opacity-90"
                    onClick={() => {}} // Search is already live as you type
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Subscription and Podcasts */}
      <section className="py-16 bg-deepPurple text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">
                  Never Miss a Message
                </h2>
                <p className="text-white/80 mb-6">
                  Subscribe to receive new sermons directly in your inbox or listen to our podcast on your favorite platform.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-grow px-4 py-3 rounded-lg text-deepPurple focus:outline-none focus:ring-2 focus:ring-gold"
                  />
                  <button className="bg-gold hover:bg-gold/90 text-white font-medium px-6 py-3 rounded-lg transition-colors duration-300 whitespace-nowrap">
                    Subscribe Now
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="#" 
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.71 14.93c-.845 1.269-2.173 2.032-3.71 2.07-1.537-.038-2.865-.801-3.71-2.07a5.947 5.947 0 01-1.29-3.71c0-3.314 2.686-6 6-6s6 2.686 6 6c0 1.37-.47 2.633-1.29 3.71zm-3.71-1.093c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z"/>
                    </svg>
                    Apple Podcasts
                  </a>
                  <a 
                    href="#" 
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm5.092 15.879c-.2.286-.659.396-.945.198-2.594-1.582-5.862-1.944-9.099-1.066-.33.088-.659-.11-.748-.44-.088-.33.11-.659.44-.748 3.43-.942 7.099-.528 9.955 1.188.33.198.396.66.198.946zm1.374-3.055c-.242.374-.77.484-1.144.242-2.97-1.825-7.495-2.351-11.001-1.287-.456.132-.924-.132-1.056-.586-.132-.456.132-.924.586-1.056 4.012-1.21 9-1.1 12.453 1.143.374.242.484.77.242 1.144zm.11-3.143c-3.563-2.117-9.44-2.311-12.843-1.28-.55.165-1.094-.143-1.26-.684-.165-.55.143-1.093.684-1.26 3.905-1.188 10.395-.946 14.495 1.474.495.286.605.88.33 1.364-.275.495-.88.605-1.364.33z"/>
                    </svg>
                    Spotify
                  </a>
                  <a 
                    href="#" 
                    className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center"
                    onClick={(e) => e.preventDefault()}
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6.18 15.64a2.18 2.18 0 100 4.36 2.18 2.18 0 000-4.36zM5.27 10.5a1 1 0 10-.001 2 1 1 0 00.001-2zM5.27 0c-1 0-1 1-1 1v9c0 1 1 1 1 1h1c1 0 1-1 1-1V1s0-1-1-1z"/>
                      <path d="M10.87 10.5a1 1 0 100 2 1 1 0 000-2zM10.87 0c-1 0-1 1-1 1v9c0 1 1 1 1 1h1c1 0 1-1 1-1V1s0-1-1-1zm5.6 10.5a1 1 0 100 2 1 1 0 000-2zM16.47 0c-1 0-1 1-1 1v9c0 1 1 1 1 1h1c1 0 1-1 1-1V1s0-1-1-1z"/>
                      <path d="M16.47 15.64c1.2 0 2.18.98 2.18 2.18S17.67 20 16.47 20s-2.18-.98-2.18-2.18.98-2.18 2.18-2.18zM11.33 20c-1 0-1 1-1 1h6.28s0-1-1-1zm-6.06 0c-1 0-1 1-1 1h6.28s0-1-1-1z"/>
                    </svg>
                    Google Podcasts
                  </a>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <img 
                  src="https://images.unsplash.com/photo-1589903308904-1010c2294adc?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Person listening to podcast" 
                  className="rounded-xl shadow-2xl"
                />
                <div className="absolute -bottom-5 -right-5 bg-gold text-white p-4 rounded-lg shadow-lg">
                  <div className="text-2xl font-bold">300+</div>
                  <div className="text-sm">Sermons Available</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Video Modal for sermon playback */}
      <AnimatePresence>
        {activeSermon && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setActiveSermon(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-5xl mx-auto bg-white rounded-xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 text-white bg-gold rounded-full w-10 h-10 flex items-center justify-center z-10 shadow-lg hover:bg-deepPurple transition-colors duration-300"
                onClick={() => setActiveSermon(null)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="aspect-w-16 aspect-h-9">
                <div className="w-full h-full flex items-center justify-center bg-black">
                  <div className="text-center p-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gold mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-white text-lg mb-2">
                      Video player would load here with sermon content.
                    </p>
                    <p className="text-gray-400 text-lg font-medium">
                      Playing: {extendedSermons.find(s => s.id === activeSermon)?.title}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-montserrat font-bold mb-3 text-deepPurple">
                  {extendedSermons.find(s => s.id === activeSermon)?.title}
                </h3>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {extendedSermons.find(s => s.id === activeSermon)?.speaker}
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {extendedSermons.find(s => s.id === activeSermon)?.date}
                  </div>
                  
                  {extendedSermons.find(s => s.id === activeSermon)?.series && (
                    <div className="flex items-center text-gray-700">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gold mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      {extendedSermons.find(s => s.id === activeSermon)?.series}
                    </div>
                  )}
                </div>
                
                <p className="mb-6 text-gray-700">
                  {extendedSermons.find(s => s.id === activeSermon)?.description}
                </p>
                
                <div className="flex flex-wrap gap-3">
                  <button className="px-5 py-2 border-2 border-deepPurple text-deepPurple rounded-lg hover:bg-deepPurple hover:text-white transition-colors duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  
                  <button className="px-5 py-2 border-2 border-deepPurple text-deepPurple rounded-lg hover:bg-deepPurple hover:text-white transition-colors duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  
                  <button className="px-5 py-2 border-2 border-deepPurple text-deepPurple rounded-lg hover:bg-deepPurple hover:text-white transition-colors duration-300 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    Notes
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sermons;
