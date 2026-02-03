import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { slideUp } from '@/lib/animations';
import { useQuery } from '@tanstack/react-query';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef } from 'react';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: eventsData, isLoading } = useQuery<{ success: boolean; data: Event[] }>({
    queryKey: ['/api/events/upcoming'],
  });

  const events = eventsData?.data || [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, events.length - 2) : Math.max(0, prev - 1)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= events.length - 2 ? 0 : prev + 1));
  };

  if (isLoading) {
    return (
      <section id="events" data-nav-theme="dark" className="py-20 bg-black/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 flex justify-center relative z-10">
          <Loader2 className="h-12 w-12 animate-spin text-gold" />
        </div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="events" data-nav-theme="dark" className="py-20 bg-black/90 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80')] bg-cover bg-center opacity-20" />
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={slideUp()}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-px bg-gold/50 w-16 md:w-32" />
              <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gold">
                Events
              </h2>
              <div className="h-px bg-gold/50 w-16 md:w-32" />
            </div>
          </motion.div>
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg mb-6">No upcoming events at the moment. Check back soon!</p>
            <Link href="/events" className="inline-block border-2 border-gold text-gold px-6 py-3 rounded-full hover:bg-gold hover:text-white transition-colors font-montserrat">
              View All Events
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" data-nav-theme="dark" className="py-20 bg-black/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&q=80')] bg-cover bg-center opacity-20" />
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={slideUp()}
        >
          <div className="flex items-center justify-center gap-4">
            <div className="h-px bg-gold/50 w-16 md:w-32" />
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-gold">
              Events
            </h2>
            <div className="h-px bg-gold/50 w-16 md:w-32" />
          </div>
        </motion.div>
        
        <div className="relative">
          <div 
            ref={containerRef}
            className="flex gap-6 justify-center overflow-hidden py-4"
          >
            {events.slice(currentIndex, currentIndex + 2).map((event, index) => (
              <motion.div 
                key={event.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex-shrink-0 w-full md:w-[45%] lg:w-[40%] max-w-lg"
              >
                <div className="rounded-lg overflow-hidden shadow-2xl bg-gray-900 hover:scale-[1.02] transition-transform duration-300">
                  <img 
                    src={event.image || 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={event.title} 
                    className="w-full h-64 md:h-80 object-cover"
                    loading="lazy"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div 
          className="flex justify-center gap-4 mt-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.2)}
        >
          <button 
            onClick={handlePrev}
            className="flex items-center gap-2 px-6 py-2 border border-gray-500 text-gray-300 rounded-full hover:border-gold hover:text-gold transition-colors font-montserrat text-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <button 
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2 border border-gray-500 text-gray-300 rounded-full hover:border-gold hover:text-gold transition-colors font-montserrat text-sm"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        <motion.div 
          className="text-center mt-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={slideUp(0.3)}
        >
          <Link href="/events" className="inline-block border-2 border-gold text-gold px-8 py-3 rounded-full hover:bg-gold hover:text-white transition-colors font-montserrat font-medium">
            View All Events
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Events;
