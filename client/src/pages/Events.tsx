import { motion } from 'framer-motion';
import { slideUp, staggerContainer } from '@/lib/animations';
import { useState } from 'react';
import { Helmet } from 'react-helmet';
import { MapPin, Clock, ArrowLeft, Calendar } from 'lucide-react';

// ─── Hardcoded events ───────────────────────────────────────────────────────────

interface Event {
  id: number;
  title: string;
  description: string;
  day: string;
  time: string;
  location: string;
  image: string;
}

const events: Event[] = [
  {
    id: 1,
    title: 'Sunday Service',
    description: 'Join us every Sunday for a powerful time of worship, the Word, and fellowship. Come expecting a life-changing encounter with God as we gather together as one church family.',
    day: 'Every Sunday',
    time: '10:00am – 12:30pm',
    location: 'Kingsborough Church, Main Auditorium',
    image: '/uploads/gallery/HOP.jpg',
  },
  {
    id: 2,
    title: 'Wednesday Bible Study',
    description: 'Midweek service designed to build your faith and deepen your understanding of the Word. Every Wednesday we gather for in-depth Bible study, prayer, and spiritual growth.',
    day: 'Every Wednesday',
    time: '7:00pm – 8:30pm',
    location: 'Kingsborough Church, Main Auditorium',
    image: '/uploads/events/Wednesday/15th-Screen.jpg (1).jpeg',
  },
  {
    id: 3,
    title: 'Friday Night Vigil',
    description: 'An intense night of prayer, worship, and spiritual warfare. The Friday Night Vigil is a powerful experience where we press into God through the night, believing for breakthrough and transformation.',
    day: 'Every 3rd Friday of the Month',
    time: '9:00pm – 12:00am',
    location: 'Kingsborough Church, Main Auditorium',
    image: '/uploads/events/Friday/Vigil-Screen.jpg (4).jpeg',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────────

const Events = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const [rsvpForm, setRsvpForm] = useState({ name: '', email: '', numberOfGuests: 1 });
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const handleRsvpChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRsvpForm(prev => ({ ...prev, [name]: value }));
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Events | Kingsborough Church</title>
        <meta name="description" content="Join us for upcoming events and gatherings at Kingsborough Church." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero */}
        <section
          data-nav-theme="dark"
          className="relative h-[50vh] md:h-[60vh] flex items-center justify-center bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.5)), url('/uploads/gallery/Our Story.jpg')`,
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

        {/* Detail view */}
        {selectedEvent ? (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
              <motion.div
                className="max-w-5xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={slideUp()}
              >
                <button
                  onClick={() => { setSelectedEvent(null); setRsvpSubmitted(false); }}
                  className="flex items-center text-deepPurple hover:text-gold mb-8 font-medium"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" /> Back to All Events
                </button>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="relative">
                    <img
                      src={selectedEvent.image}
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
                          <div className="flex items-center text-gray-700 gap-2">
                            <Calendar className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>{selectedEvent.day}</span>
                          </div>
                          <div className="flex items-center text-gray-700 gap-2">
                            <Clock className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>{selectedEvent.time}</span>
                          </div>
                          <div className="flex items-center text-gray-700 gap-2">
                            <MapPin className="w-5 h-5 text-gold flex-shrink-0" />
                            <span>{selectedEvent.location}</span>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="text-xl font-montserrat font-semibold mb-4 text-deepPurple">About This Event</h3>
                          <p className="text-gray-600 leading-relaxed text-lg">{selectedEvent.description}</p>
                        </div>
                      </div>

                      <div className="lg:w-1/3">
                        <div className="bg-gray-50 p-6 rounded-xl">
                          <h3 className="text-xl font-montserrat font-semibold mb-4 text-deepPurple">Plan Your Visit</h3>

                          {rsvpSubmitted ? (
                            <div className="text-center py-4">
                              <div className="text-green-500 text-4xl mb-3">✓</div>
                              <h4 className="text-lg font-semibold mb-2">Thank You!</h4>
                              <p className="text-gray-600">We look forward to seeing you.</p>
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
                                  {[1,2,3,4,5,6,7,8,9,10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                  ))}
                                </select>
                              </div>
                              <button
                                type="submit"
                                className="w-full bg-gold text-white py-3 rounded-lg font-montserrat font-semibold hover:bg-gold/90 transition-colors"
                              >
                                Confirm Attendance
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
          /* Events grid */
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                <p className="text-gold font-montserrat font-semibold uppercase tracking-widest text-sm mb-2">Weekly Services</p>
                <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-deepPurple">Join Us This Week</h2>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
                variants={staggerContainer()}
                initial="hidden"
                animate="visible"
              >
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    className="group cursor-pointer"
                    variants={slideUp((index + 1) * 0.1)}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative overflow-hidden h-64">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                          Ongoing
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="text-xl font-montserrat font-bold text-deepPurple mb-3 group-hover:text-gold transition-colors">
                          {event.title}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-gray-600 gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gold flex-shrink-0" />
                            <span>{event.day}</span>
                          </div>
                          <div className="flex items-center text-gray-600 gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center text-gray-600 gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gold flex-shrink-0" />
                            <span>{event.location}</span>
                          </div>
                        </div>

                        <button className="mt-2 text-sm font-montserrat font-semibold text-gold hover:text-deepPurple transition-colors">
                          Learn More →
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </>
  );
};

export default Events;
