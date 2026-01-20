import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Loader2, MapPin, ArrowLeft } from 'lucide-react';

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

  const { data: eventsData, isLoading } = useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ['/api/events'],
  });

  const events = eventsData?.data || [];

  const selectedEvent = eventId 
    ? events.find(e => e.id === parseInt(eventId)) 
    : null;

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
    console.log('RSVP submitted:', rsvpForm);
    setRsvpSubmitted(true);
  };

  const getDateBadge = (dateStr: string) => {
    if (dateStr === "Every Sunday") return { month: "", day: "" };
    try {
      const date = new Date(dateStr);
      const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
      const day = date.getDate();
      return { month, day: day.toString() };
    } catch {
      return { month: "", day: "" };
    }
  };

  const isOngoing = (dateStr: string) => {
    if (dateStr.toLowerCase().includes("every")) return true;
    try {
      const eventDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate <= today;
    } catch {
      return false;
    }
  };

  return (
    <>
      <Helmet>
        <title>Events | Kingsborough Church</title>
        <meta name="description" content="Join us for upcoming events and gatherings at Kingsborough Church." />
      </Helmet>
      
      <div className="min-h-screen">
        <section 
          className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')` 
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-montserrat font-bold text-gold"
          >
            Events
          </motion.h1>
        </section>

        {isLoading ? (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 flex justify-center">
              <Loader2 className="h-12 w-12 animate-spin text-gold" />
            </div>
          </section>
        ) : selectedEvent ? (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div 
                className="max-w-5xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={slideUp()}
              >
                <button 
                  onClick={() => window.history.back()} 
                  className="flex items-center text-deepPurple hover:text-gold mb-8 font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Events
                </button>
                
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={selectedEvent.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'} 
                      alt={selectedEvent.title} 
                      className="w-full h-80 md:h-[500px] object-cover"
                    />
                  </div>
                  
                  <div className="p-8 md:p-12">
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-8">
                      <div className="lg:w-2/3">
                        <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
                          {selectedEvent.title}
                        </h2>
                        
                        <div className="space-y-3 mb-8">
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold mr-2">Date:</span> {selectedEvent.date}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <span className="font-semibold mr-2">Time:</span> {selectedEvent.time}
                          </div>
                          <div className="flex items-center text-gray-700">
                            <MapPin className="w-5 h-5 text-gold mr-2" />
                            {selectedEvent.location}
                          </div>
                        </div>
                        
                        <div className="mb-8">
                          <h3 className="text-xl font-montserrat font-semibold mb-4 text-deepPurple">About This Event</h3>
                          <p className="text-gray-600 leading-relaxed text-lg">
                            {selectedEvent.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="lg:w-1/3" id="rsvp">
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h3 className="text-xl font-montserrat font-semibold mb-4 text-deepPurple">RSVP for This Event</h3>
                          
                          {rsvpSubmitted ? (
                            <div className="text-center py-4">
                              <div className="text-green-500 text-4xl mb-3">✓</div>
                              <h4 className="text-lg font-semibold mb-2">Thank You!</h4>
                              <p className="text-gray-600">Your RSVP has been received.</p>
                            </div>
                          ) : (
                            <form onSubmit={handleRsvpSubmit} className="space-y-4">
                              <div>
                                <label className="block text-gray-700 font-medium mb-2">Your Name</label>
                                <input
                                  type="text"
                                  name="name"
                                  value={rsvpForm.name}
                                  onChange={handleRsvpChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 font-medium mb-2">Email Address</label>
                                <input
                                  type="email"
                                  name="email"
                                  value={rsvpForm.email}
                                  onChange={handleRsvpChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-gray-700 font-medium mb-2">Number of Guests</label>
                                <select
                                  name="numberOfGuests"
                                  value={rsvpForm.numberOfGuests}
                                  onChange={handleRsvpChange}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num}</option>
                                  ))}
                                </select>
                              </div>
                              <button type="submit" className="w-full bg-gold text-white py-3 rounded-lg font-montserrat font-semibold hover:bg-gold/90 transition-colors">
                                Confirm RSVP
                              </button>
                            </form>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        ) : (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
              {events.length === 0 ? (
                <div className="text-center py-16">
                  <h2 className="text-2xl font-montserrat font-bold text-deepPurple mb-4">No Events Yet</h2>
                  <p className="text-gray-600">Check back soon for upcoming events!</p>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                  variants={staggerContainer()}
                  initial="hidden"
                  animate="visible"
                >
                  {events.map((event, index) => {
                    const dateBadge = getDateBadge(event.date);
                    const ongoing = isOngoing(event.date);
                    
                    return (
                      <motion.a 
                        key={event.id}
                        href={`/events?id=${event.id}`}
                        className="block group"
                        variants={slideUp((index + 1) * 0.1)}
                      >
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
                          <div className="relative">
                            <img 
                              src={event.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                              alt={event.title} 
                              className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            
                            {dateBadge.month && (
                              <div className="absolute top-4 left-4 bg-deepPurple text-white rounded-lg overflow-hidden shadow-lg">
                                <div className="bg-gold px-3 py-1 text-xs font-bold text-center">
                                  {dateBadge.month}
                                </div>
                                <div className="px-4 py-2 text-2xl font-bold text-center">
                                  {dateBadge.day}
                                </div>
                              </div>
                            )}
                            
                            {ongoing && (
                              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                Ongoing
                              </div>
                            )}
                          </div>
                          
                          <div className="p-6">
                            <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-2 group-hover:text-gold transition-colors">
                              {event.title}
                            </h3>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                              <span className="text-sm">{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </motion.a>
                    );
                  })}
                </motion.div>
              )}
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Events;
