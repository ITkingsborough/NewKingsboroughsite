import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp, staggerContainer } from '@/lib/animations';
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
  const { data: eventsData, isLoading } = useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ['/api/events/upcoming'],
  });

  const events = eventsData?.data || [];

  if (isLoading) {
    return (
      <section id="events" className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-8 flex justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-gold" />
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return null;
  }

  return (
    <section id="events" className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-6 text-deepPurple">
            Upcoming Events
          </h2>
          <p className="text-lg max-w-3xl mx-auto">
            Join us for these special gatherings and become part of our vibrant community.
          </p>
        </motion.div>
        
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
              </div>
              <div className="p-6">
                <h3 className="text-xl font-montserrat font-semibold mb-2">{event.title}</h3>
                <p className="text-sm text-gray-600 mb-3">
                  <i className="far fa-calendar-alt mr-2"></i> {event.date} at {event.time}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <i className="fas fa-map-marker-alt mr-2"></i> {event.location}
                </p>
                <p>{event.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.3)}
        >
          <Link href="/events" className="btn-primary">View All Events</Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
