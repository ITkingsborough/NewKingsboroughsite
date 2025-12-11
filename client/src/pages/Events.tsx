import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string | null;
  featured: boolean;
}

const Events = () => {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const eventId = searchParams.get('id');

  // Fetch events from API
  const { data: eventsData, isLoading } = useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ['/api/events'],
  });

  const events = eventsData?.data || [];

  const selectedEvent = eventId 
    ? events.find(e => e.id === parseInt(eventId)) 
    : null;

  // State for RSVP form
  const [rsvpForm, setRsvpForm] = useState({
    name: '',
    email: '',
    numberOfGuests: 1,
  });
  
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRsvpForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, we would submit this to an API endpoint
    console.log('RSVP submitted:', rsvpForm);
    setRsvpSubmitted(true);
  };

  // Calculate days remaining for event (if it's a future event)
  const calculateDaysRemaining = (eventDate: string) => {
    // Skip for recurring events
    if (eventDate === "Every Sunday") return null;
    
    const date = new Date(eventDate);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : null;
  };

  return (
    <>
      <Helmet>
        <title>Events | Kingsborough Church</title>
        <meta name="description" content="Join us for upcoming events and gatherings at Kingsborough Church." />
      </Helmet>
      <div className="pt-24">
        {/* Hero Section */}
        <section className="relative h-80 md:h-96 flex items-center parallax" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` }}>
          <div className="absolute inset-0 overlay-gold"></div>
          <div className="container mx-auto px-4 lg:px-8 z-10">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={slideUp()}
              className="max-w-3xl"
            >
              <h1 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4 tracking-tight text-shadow">Upcoming Events</h1>
              <p className="text-xl text-white opacity-90 font-light">
                Join us for these special gatherings and become part of our vibrant community.
              </p>
            </motion.div>
          </div>
        </section>

        {isLoading ? (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8 flex justify-center items-center">
              <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </div>
          </section>
        ) : events.length === 0 ? (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8 text-center">
              <h2 className="text-2xl font-montserrat font-bold text-deepPurple mb-4">No Events Yet</h2>
              <p className="text-gray-600">Check back soon for upcoming events!</p>
            </div>
          </section>
        ) : selectedEvent ? (
          // Single Event View
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div 
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={slideUp()}
              >
                <div className="mb-8">
                  <button 
                    onClick={() => window.history.back()} 
                    className="flex items-center text-gold hover:underline"
                  >
                    <i className="fas fa-arrow-left mr-2"></i> Back to All Events
                  </button>
                </div>
                
                <div className="rounded-lg overflow-hidden mb-8 h-96 relative">
                  <img 
                    src={selectedEvent.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'} 
                    alt={selectedEvent.title} 
                    className="w-full h-full object-cover"
                  />
                  {calculateDaysRemaining(selectedEvent.date) && (
                    <div className="absolute top-4 right-4 bg-gold text-white py-2 px-4 rounded-lg font-montserrat font-medium">
                      <span>{calculateDaysRemaining(selectedEvent.date)} days away</span>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
                  <div className="md:w-2/3">
                    <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
                      {selectedEvent.title}
                    </h2>
                    
                    <div className="mb-8">
                      <div className="flex items-center mb-3">
                        <i className="far fa-calendar-alt text-gold mr-3"></i>
                        <span className="font-semibold">{selectedEvent.date}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <i className="far fa-clock text-gold mr-3"></i>
                        <span className="font-semibold">{selectedEvent.time}</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <i className="fas fa-map-marker-alt text-gold mr-3"></i>
                        <span className="font-semibold">{selectedEvent.location}</span>
                      </div>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-montserrat font-semibold mb-4">About This Event</h3>
                      <p className="text-lg leading-relaxed">
                        {selectedEvent.description}
                      </p>
                      <p className="text-lg leading-relaxed mt-4">
                        Join us for this special event where we'll come together as a community to worship,
                        connect, and grow in our faith. This is a great opportunity to invite friends and family
                        who might be interested in experiencing our church community.
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
                      <a href="#rsvp" className="btn-primary">RSVP Now</a>
                      <button className="btn-outline" onClick={() => {
                        const calendarEvent = {
                          title: selectedEvent.title,
                          location: selectedEvent.location,
                          details: selectedEvent.description,
                          // Format date properly for calendar event
                          start: new Date(selectedEvent.date + ' ' + selectedEvent.time.split(' - ')[0]).toISOString(),
                          end: new Date(selectedEvent.date + ' ' + selectedEvent.time.split(' - ')[1] || '').toISOString()
                        };
                        alert('Calendar event would be created with: ' + JSON.stringify(calendarEvent));
                      }}>
                        Add to Calendar
                      </button>
                    </div>
                    
                    <div className="mb-8">
                      <h3 className="text-xl font-montserrat font-semibold mb-4">Share This Event</h3>
                      <div className="flex space-x-4">
                        <a 
                          href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                        >
                          <i className="fab fa-facebook-f"></i>
                        </a>
                        <a 
                          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent('Join me at ' + selectedEvent.title)}`} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                        >
                          <i className="fab fa-twitter"></i>
                        </a>
                        <a 
                          href={`mailto:?subject=${encodeURIComponent('Join me at ' + selectedEvent.title)}&body=${encodeURIComponent('I thought you might be interested in this event: ' + window.location.href)}`} 
                          className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white hover:bg-opacity-90 transition-all duration-300"
                        >
                          <i className="fas fa-envelope"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  
                  <div className="md:w-1/3" id="rsvp">
                    <div className="bg-lilac bg-opacity-10 p-6 rounded-lg">
                      <h3 className="text-xl font-montserrat font-semibold mb-4">RSVP for This Event</h3>
                      
                      {rsvpSubmitted ? (
                        <div className="text-center py-4">
                          <i className="fas fa-check-circle text-green-500 text-4xl mb-3"></i>
                          <h4 className="text-lg font-semibold mb-2">Thank You!</h4>
                          <p>Your RSVP has been received. We look forward to seeing you!</p>
                        </div>
                      ) : (
                        <form onSubmit={handleRsvpSubmit}>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="name">
                              Your Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              name="name"
                              value={rsvpForm.name}
                              onChange={handleRsvpChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="email">
                              Email Address
                            </label>
                            <input
                              type="email"
                              id="email"
                              name="email"
                              value={rsvpForm.email}
                              onChange={handleRsvpChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-gray-700 font-medium mb-2" htmlFor="numberOfGuests">
                              Number of Guests
                            </label>
                            <select
                              id="numberOfGuests"
                              name="numberOfGuests"
                              value={rsvpForm.numberOfGuests}
                              onChange={handleRsvpChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          <button type="submit" className="btn-primary w-full">
                            Confirm RSVP
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        ) : (
          // All Events View
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div 
                className="max-w-4xl mx-auto text-center mb-16"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp()}
              >
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">Come Join Us</h2>
                <p className="text-lg">
                  Our church hosts a variety of events throughout the year for all ages and interests.
                  From weekly worship services to special gatherings, there's always something happening at Kingsborough Church.
                </p>
              </motion.div>
              
              {/* Events Calendar Tabs */}
              <motion.div 
                className="mb-12 max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.2)}
              >
                <div className="flex flex-wrap border-b border-gray-200">
                  <button className="px-6 py-3 text-deepPurple font-montserrat font-medium border-b-2 border-gold">
                    Upcoming Events
                  </button>
                  <button className="px-6 py-3 text-gray-500 font-montserrat font-medium hover:text-deepPurple">
                    Weekly Schedule
                  </button>
                  <button className="px-6 py-3 text-gray-500 font-montserrat font-medium hover:text-deepPurple">
                    Calendar View
                  </button>
                </div>
              </motion.div>
              
              {/* Featured Events */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                variants={staggerContainer()}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
              >
                {events.map((event, index) => (
                  <motion.div 
                    key={event.id} 
                    className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
                    variants={slideUp((index + 1) * 0.1)}
                    whileHover={{ 
                      y: -5,
                      boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
                      transition: { duration: 0.3 }
                    }}
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={event.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'} 
                        alt={event.title} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-0 left-0 bg-gold text-white py-2 px-4 font-montserrat font-medium">
                        <span>{event.date.split(',')[0]}</span>
                      </div>
                      
                      {calculateDaysRemaining(event.date) && (
                        <div className="absolute bottom-0 right-0 bg-deepPurple text-white py-1 px-3 font-montserrat text-sm">
                          <span>{calculateDaysRemaining(event.date)} days away</span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-montserrat font-semibold mb-2">{event.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">
                        <i className="far fa-calendar-alt mr-2"></i> {event.date} at {event.time}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <i className="fas fa-map-marker-alt mr-2"></i> {event.location}
                      </p>
                      <p className="mb-6">{event.description}</p>
                      <a 
                        href={`/events?id=${event.id}`}
                        className="btn-outline"
                      >
                        Learn More
                      </a>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              
              {/* Additional Events List */}
              <motion.div 
                className="mt-16 max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={slideUp(0.3)}
              >
                <h3 className="text-2xl font-montserrat font-semibold mb-6">More Upcoming Events</h3>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {[
                    {
                      title: "Men's Bible Study",
                      date: "Every Tuesday",
                      time: "6:30 PM - 8:00 PM",
                      location: "Fellowship Hall"
                    },
                    {
                      title: "Women's Book Club",
                      date: "First Thursday of each month",
                      time: "7:00 PM - 9:00 PM",
                      location: "Community Room"
                    },
                    {
                      title: "Youth Game Night",
                      date: "November 15, 2023",
                      time: "6:00 PM - 9:00 PM",
                      location: "Youth Center"
                    },
                    {
                      title: "Community Service Day",
                      date: "November 18, 2023",
                      time: "9:00 AM - 2:00 PM",
                      location: "Meet at Church Parking Lot"
                    },
                    {
                      title: "Thanksgiving Potluck",
                      date: "November 23, 2023",
                      time: "5:00 PM - 8:00 PM",
                      location: "Fellowship Hall"
                    }
                  ].map((event, index) => (
                    <div 
                      key={index} 
                      className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between ${
                        index !== 4 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <div>
                        <h4 className="font-montserrat font-semibold text-lg mb-1">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          <i className="far fa-calendar-alt mr-2"></i> {event.date} at {event.time}
                        </p>
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-map-marker-alt mr-2"></i> {event.location}
                        </p>
                      </div>
                      <a 
                        href="#" 
                        className="mt-3 sm:mt-0 text-gold font-montserrat font-medium hover:underline inline-flex items-center"
                        onClick={(e) => e.preventDefault()}
                      >
                        Details <i className="fas fa-arrow-right ml-2 text-sm"></i>
                      </a>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <button className="btn-outline">View Full Calendar</button>
                </div>
              </motion.div>
              
              {/* Event Registration CTA */}
              <motion.div 
                className="mt-20 bg-lilac bg-opacity-20 p-8 md:p-12 rounded-lg text-center max-w-4xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={slideUp(0.4)}
              >
                <h3 className="text-2xl md:text-3xl font-montserrat font-bold mb-4 text-gold">
                  Plan Your Visit
                </h3>
                <p className="text-lg mb-8 max-w-2xl mx-auto text-white">
                  Whether you're joining us for a Sunday service or a special event, 
                  we want to make your visit as enjoyable as possible.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <button className="btn-primary">Get Directions</button>
                  <button className="btn-secondary">Contact Us</button>
                </div>
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Events;
